/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 * @format
 */

'use strict';

const _require = require('../../error-utils'),
  throwIfArgumentPropsAreNull = _require.throwIfArgumentPropsAreNull,
  throwIfBubblingTypeIsNull = _require.throwIfBubblingTypeIsNull,
  throwIfEventHasNoName = _require.throwIfEventHasNoName;
const _require2 = require('../../parsers-commons'),
  buildPropertiesForEvent = _require2.buildPropertiesForEvent,
  emitBuildEventSchema = _require2.emitBuildEventSchema,
  getEventArgument = _require2.getEventArgument,
  handleEventHandler = _require2.handleEventHandler;
const _require3 = require('../../parsers-primitives'),
  emitBoolProp = _require3.emitBoolProp,
  emitDoubleProp = _require3.emitDoubleProp,
  emitFloatProp = _require3.emitFloatProp,
  emitInt32Prop = _require3.emitInt32Prop,
  emitMixedProp = _require3.emitMixedProp,
  emitObjectProp = _require3.emitObjectProp,
  emitStringProp = _require3.emitStringProp,
  emitUnionProp = _require3.emitUnionProp;
const _require4 = require('../parseTopLevelType'),
  parseTopLevelType = _require4.parseTopLevelType;
const _require5 = require('./componentsUtils'),
  flattenProperties = _require5.flattenProperties;
function getPropertyType(
  /* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
   * LTI update could not be added via codemod */
  name,
  optionalProperty,
  /* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
   * LTI update could not be added via codemod */
  annotation,
  parser,
) {
  const topLevelType = parseTopLevelType(annotation);
  const typeAnnotation = topLevelType.type;
  const optional = optionalProperty || topLevelType.optional;
  const type =
    typeAnnotation.type === 'TSTypeReference'
      ? parser.getTypeAnnotationName(typeAnnotation)
      : typeAnnotation.type;
  switch (type) {
    case 'TSBooleanKeyword':
      return emitBoolProp(name, optional);
    case 'TSStringKeyword':
      return emitStringProp(name, optional);
    case 'Int32':
      return emitInt32Prop(name, optional);
    case 'Double':
      return emitDoubleProp(name, optional);
    case 'Float':
      return emitFloatProp(name, optional);
    case 'TSTypeLiteral':
      return emitObjectProp(
        name,
        optional,
        parser,
        typeAnnotation,
        extractArrayElementType,
      );
    case 'TSUnionType':
      return emitUnionProp(name, optional, parser, typeAnnotation);
    case 'UnsafeMixed':
      return emitMixedProp(name, optional);
    case 'TSArrayType':
      return {
        name,
        optional,
        typeAnnotation: extractArrayElementType(typeAnnotation, name, parser),
      };
    default:
      throw new Error(`Unable to determine event type for "${name}": ${type}`);
  }
}
function extractArrayElementType(typeAnnotation, name, parser) {
  const type = extractTypeFromTypeAnnotation(typeAnnotation, parser);
  switch (type) {
    case 'TSParenthesizedType':
      return extractArrayElementType(
        typeAnnotation.typeAnnotation,
        name,
        parser,
      );
    case 'TSBooleanKeyword':
      return {
        type: 'BooleanTypeAnnotation',
      };
    case 'TSStringKeyword':
      return {
        type: 'StringTypeAnnotation',
      };
    case 'Float':
      return {
        type: 'FloatTypeAnnotation',
      };
    case 'Int32':
      return {
        type: 'Int32TypeAnnotation',
      };
    case 'TSNumberKeyword':
    case 'Double':
      return {
        type: 'DoubleTypeAnnotation',
      };
    case 'TSUnionType':
      return {
        type: 'StringLiteralUnionTypeAnnotation',
        types: typeAnnotation.types.map(option => ({
          type: 'StringLiteralTypeAnnotation',
          value: parser.getLiteralValue(option),
        })),
      };
    case 'TSTypeLiteral':
      return {
        type: 'ObjectTypeAnnotation',
        properties: parser
          .getObjectProperties(typeAnnotation)
          .map(member =>
            buildPropertiesForEvent(member, parser, getPropertyType),
          ),
      };
    case 'TSArrayType':
      return {
        type: 'ArrayTypeAnnotation',
        elementType: extractArrayElementType(
          typeAnnotation.elementType,
          name,
          parser,
        ),
      };
    default:
      throw new Error(
        `Unrecognized ${type} for Array ${name} in events.\n${JSON.stringify(
          typeAnnotation,
          null,
          2,
        )}`,
      );
  }
}
function extractTypeFromTypeAnnotation(typeAnnotation, parser) {
  return typeAnnotation.type === 'TSTypeReference'
    ? parser.getTypeAnnotationName(typeAnnotation)
    : typeAnnotation.type;
}
function findEventArgumentsAndType(
  parser,
  typeAnnotation,
  types,
  bubblingType,
  paperName,
) {
  if (typeAnnotation.type === 'TSInterfaceDeclaration') {
    return {
      argumentProps: flattenProperties([typeAnnotation], types, parser),
      paperTopLevelNameDeprecated: paperName,
      bubblingType,
    };
  }
  if (typeAnnotation.type === 'TSTypeLiteral') {
    return {
      argumentProps: parser.getObjectProperties(typeAnnotation),
      paperTopLevelNameDeprecated: paperName,
      bubblingType,
    };
  }
  throwIfEventHasNoName(typeAnnotation, parser);
  const name = parser.getTypeAnnotationName(typeAnnotation);
  if (name === 'Readonly') {
    return findEventArgumentsAndType(
      parser,
      typeAnnotation.typeParameters.params[0],
      types,
      bubblingType,
      paperName,
    );
  } else if (name === 'BubblingEventHandler' || name === 'DirectEventHandler') {
    return handleEventHandler(
      name,
      typeAnnotation,
      parser,
      types,
      findEventArgumentsAndType,
    );
  } else if (types[name]) {
    let elementType = types[name];
    if (elementType.type === 'TSTypeAliasDeclaration') {
      elementType = elementType.typeAnnotation;
    }
    return findEventArgumentsAndType(
      parser,
      elementType,
      types,
      bubblingType,
      paperName,
    );
  } else {
    return {
      argumentProps: null,
      bubblingType: null,
      paperTopLevelNameDeprecated: null,
    };
  }
}

// $FlowFixMe[unclear-type] TODO(T108222691): Use flow-types for @babel/parser

function buildEventSchema(types, property, parser) {
  // unpack WithDefault, (T) or T|U
  const topLevelType = parseTopLevelType(
    property.typeAnnotation.typeAnnotation,
    types,
  );
  const name = property.key.name;
  const typeAnnotation = topLevelType.type;
  const optional = property.optional || topLevelType.optional;
  const _findEventArgumentsAn = findEventArgumentsAndType(
      parser,
      typeAnnotation,
      types,
    ),
    argumentProps = _findEventArgumentsAn.argumentProps,
    bubblingType = _findEventArgumentsAn.bubblingType,
    paperTopLevelNameDeprecated =
      _findEventArgumentsAn.paperTopLevelNameDeprecated;
  const nonNullableArgumentProps = throwIfArgumentPropsAreNull(
    argumentProps,
    name,
  );
  const nonNullableBubblingType = throwIfBubblingTypeIsNull(bubblingType, name);
  const argument = getEventArgument(
    nonNullableArgumentProps,
    parser,
    getPropertyType,
  );
  return emitBuildEventSchema(
    paperTopLevelNameDeprecated,
    name,
    optional,
    nonNullableBubblingType,
    argument,
  );
}
function getEvents(eventTypeAST, types, parser) {
  return eventTypeAST
    .map(property => buildEventSchema(types, property, parser))
    .filter(Boolean);
}
module.exports = {
  getEvents,
  extractArrayElementType,
};
