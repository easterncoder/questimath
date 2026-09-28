const assert = require('assert');
const {
  getBossEncounter,
  normalizeBoss,
  resolveBossAnswer
} = require('../boss-encounters');

assert.strictEqual(getBossEncounter(4, null), null);
assert.deepStrictEqual(getBossEncounter(5, null), { rank: 5, hp: 100, playerHp: 100 });
assert.deepStrictEqual(getBossEncounter(6, { rank: 5, hp: 40, playerHp: 80 }), { rank: 5, hp: 40, playerHp: 80 });
assert.deepStrictEqual(getBossEncounter(5, { rank: 5, hp: 0, playerHp: 80 }), { rank: 5, hp: 0, playerHp: 80 });
assert.deepStrictEqual(getBossEncounter(10, { rank: 5, hp: 0, playerHp: 80 }), { rank: 10, hp: 100, playerHp: 100 });
assert.strictEqual(normalizeBoss({ rank: 5, hp: 'bad', playerHp: 100 }), null);
assert.deepStrictEqual(normalizeBoss({ rank: 5, hp: 200, playerHp: -5 }), { rank: 5, hp: 100, playerHp: 1 });

const firstHit = resolveBossAnswer(getBossEncounter(5, null), true, 1);
assert.strictEqual(firstHit.damage, 20);
assert.strictEqual(firstHit.boss.hp, 80);

const comboHit = resolveBossAnswer(firstHit.boss, true, 6);
assert.strictEqual(comboHit.multiplier, 3);
assert.strictEqual(comboHit.boss.hp, 20);

const finalHit = resolveBossAnswer(comboHit.boss, true, 7);
assert.strictEqual(finalHit.damage, 20);
assert.strictEqual(finalHit.defeated, true);
assert.strictEqual(finalHit.boss.hp, 0);

const strike = resolveBossAnswer(firstHit.boss, false, 4);
assert.strictEqual(strike.strike, 20);
assert.strictEqual(strike.boss.playerHp, 80);
assert.strictEqual(strike.boss.hp, 80);

const knockout = resolveBossAnswer({ rank: 5, hp: 40, playerHp: 20 }, false, 0);
assert.strictEqual(knockout.knockedOut, true);
assert.deepStrictEqual(knockout.boss, { rank: 5, hp: 60, playerHp: 100 });

console.log('boss encounter tests passed');
