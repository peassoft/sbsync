import { test, expect } from 'vitest';

import self from './is-plain-object.js';

function ObjectConstructor() {}

test('primitive values', () => {
  expect(self(null)).toBe(false);
  expect(self(undefined)).toBe(false);
  expect(self('')).toBe(false);
  expect(self(1)).toBe(false);
  expect(self(1n)).toBe(false);
  expect(self(true)).toBe(false);
  expect(self(false)).toBe(false);
  expect(self(Symbol(''))).toBe(false);
  expect(self(Number.NaN)).toBe(false);
});

test('valid values', () => {
  expect(self({})).toBe(true);
  expect(self({ a: 1 })).toBe(true);
  expect(self(Object.create(null))).toBe(true);
  expect(self({ constructor: ObjectConstructor })).toBe(true);
  expect(self({ valueOf: 0 })).toBe(true);
  /* eslint-disable-next-line no-object-constructor */
  expect(self(new Object())).toBe(true);
});

test('arrays', () => {
  expect(self(['foo', 'bar'])).toBe(false);
});

test('objects created via constructor functions', () => {
  // We need to test this case for use in JS
  // @ts-expect-error: new' expression, whose target lacks a construct signature,
  // implicitly has an 'any' type
  expect(self(new ObjectConstructor())).toBe(false);
});

test('functions', () => {
  expect(self(() => {})).toBe(false);
});

test('instances of classes', () => {
  expect(self(new class Foo {}())).toBe(false);
});

test('build-in objects', () => {
  expect(self(Math)).toBe(false);
  expect(self(JSON)).toBe(false);
  expect(self(Atomics)).toBe(false);
  expect(self(new Error(''))).toBe(false);
  expect(self(new Date())).toBe(false);
  /* eslint-disable-next-line prefer-regex-literals */
  expect(self(new RegExp('abc'))).toBe(false);
});

test('objects with custom prototype', () => {
  expect(self(Object.create({}))).toBe(false);
});

test('arguments object', () => {
  (function() {
    /* eslint-disable-next-line  prefer-rest-params */
    expect(self(arguments)).toBe(false);
  }());
});
