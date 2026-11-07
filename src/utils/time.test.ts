import test from 'node:test';
import assert from 'node:assert/strict';
import { getTimeParts, formatDate, formatDuration } from './time.ts';

test('getTimeParts handles 24h format', () => {
  const date = new Date(2026, 10, 7, 18, 47, 48); // 18:47:48
  const parts = getTimeParts(date, '24h');
  assert.equal(parts.hours, '18');
  assert.equal(parts.minutes, '47');
  assert.equal(parts.seconds, '48');
  assert.equal(parts.period, '');
});

test('getTimeParts handles 12h format PM', () => {
  const date = new Date(2026, 10, 7, 18, 50, 9); // 6:50:09 PM
  const parts = getTimeParts(date, '12h');
  assert.equal(parts.hours, '6');
  assert.equal(parts.minutes, '50');
  assert.equal(parts.seconds, '09');
  assert.equal(parts.period, 'PM');
});

test('getTimeParts handles 12h format midnight/noon', () => {
  const midnight = new Date(2026, 10, 7, 0, 5, 0);
  assert.equal(getTimeParts(midnight, '12h').hours, '12');
  assert.equal(getTimeParts(midnight, '12h').period, 'AM');

  const noon = new Date(2026, 10, 7, 12, 0, 0);
  assert.equal(getTimeParts(noon, '12h').hours, '12');
  assert.equal(getTimeParts(noon, '12h').period, 'PM');
});

test('formatDate produces expected representations', () => {
  const date = new Date(2026, 10, 7); // Nov 7, 2026 is Saturday
  assert.match(formatDate(date, 'full'), /Saturday, 7 November 2026/);
  assert.equal(formatDate(date, 'short'), 'Sat, 7 Nov');
  assert.equal(formatDate(date, 'compact'), '07/11/2026');
  assert.equal(formatDate(date, 'iso'), '2026-11-07');
  assert.equal(formatDate(date, 'none'), '');
});

test('formatDuration formats seconds properly', () => {
  assert.equal(formatDuration(0), '0:00');
  assert.equal(formatDuration(65), '1:05');
  assert.equal(formatDuration(2045), '34:05');
  assert.equal(formatDuration(3661), '1:01:01');
  assert.equal(formatDuration(-10), '0:00');
});
