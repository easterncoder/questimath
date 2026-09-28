(function (root) {
  const BOSS_INTERVAL = 5;
  const BOSS_MAX_HP = 100;
  const PLAYER_MAX_HP = 100;
  const BOSS_STRIKE_DAMAGE = 20;

  /*
   * Restores a compact encounter only when its saved values are valid.
   */
  function normalizeBoss(boss) {
    if (!boss || !Number.isInteger(boss.rank) || boss.rank < BOSS_INTERVAL || boss.rank % BOSS_INTERVAL !== 0) {
      return null;
    }

    const hp = Number(boss.hp);
    const playerHp = Number(boss.playerHp);

    if (!Number.isFinite(hp) || !Number.isFinite(playerHp)) {
      return null;
    }

    return {
      rank: boss.rank,
      hp: Math.min(Math.max(Math.round(hp), 0), BOSS_MAX_HP),
      playerHp: Math.min(Math.max(Math.round(playerHp), 1), PLAYER_MAX_HP)
    };
  }

  /*
   * Keeps an unfinished boss active and starts encounters at rank milestones.
   */
  function getBossEncounter(level, savedBoss) {
    const boss = normalizeBoss(savedBoss);

    if (boss && (boss.hp > 0 || boss.rank === level)) {
      return boss;
    }

    if (!Number.isInteger(level) || level < BOSS_INTERVAL || level % BOSS_INTERVAL !== 0) {
      return null;
    }

    return { rank: level, hp: BOSS_MAX_HP, playerHp: PLAYER_MAX_HP };
  }

  /*
   * Keeps one valid queued encounter for each reached milestone.
   */
  function normalizeBossQueue(bosses) {
    if (!Array.isArray(bosses)) {
      return [];
    }

    const seenRanks = new Set();

    return bosses
      .map(normalizeBoss)
      .filter((boss) => {
        if (!boss || seenRanks.has(boss.rank)) {
          return false;
        }

        seenRanks.add(boss.rank);
        return true;
      })
      .sort((first, second) => first.rank - second.rank);
  }

  /*
   * Queues every boss milestone reached between two Adventure ranks.
   */
  function queueBossMilestones(previousLevel, nextLevel, activeBoss, pendingBosses) {
    const active = normalizeBoss(activeBoss);
    const pending = normalizeBossQueue(pendingBosses);
    const knownRanks = new Set(pending.map((boss) => boss.rank));

    if (active) {
      knownRanks.add(active.rank);
    }

    const firstMilestone = Math.floor(previousLevel / BOSS_INTERVAL) * BOSS_INTERVAL + BOSS_INTERVAL;

    for (let rank = firstMilestone; rank <= nextLevel; rank += BOSS_INTERVAL) {
      if (!knownRanks.has(rank)) {
        pending.push({ rank, hp: BOSS_MAX_HP, playerHp: PLAYER_MAX_HP });
        knownRanks.add(rank);
      }
    }

    return pending.sort((first, second) => first.rank - second.rank);
  }

  /*
   * Restores the active encounter and any queued milestones from saved progress.
   */
  function getBossEncounterState(level, savedBoss, savedQueue) {
    const boss = normalizeBoss(savedBoss);
    const queue = normalizeBossQueue(savedQueue).filter((queuedBoss) => queuedBoss.rank <= level);

    if (boss && (boss.hp > 0 || boss.rank === level)) {
      return { boss, pendingBosses: queue };
    }

    if (queue.length > 0) {
      return { boss: queue.shift(), pendingBosses: queue };
    }

    return {
      boss: getBossEncounter(level, null),
      pendingBosses: []
    };
  }

  /*
   * Applies one Adventure answer to the active boss encounter.
   */
  function resolveBossAnswer(boss, correct, streak) {
    const activeBoss = normalizeBoss(boss);

    if (!activeBoss || activeBoss.hp === 0) {
      return { boss: activeBoss, damage: 0, strike: 0, defeated: false, knockedOut: false, multiplier: 1 };
    }

    if (correct) {
      const multiplier = Math.min(1 + Math.floor(Math.max(0, streak) / 3), 3);
      const damage = Math.min(20 * multiplier, activeBoss.hp);
      const nextBoss = { ...activeBoss, hp: activeBoss.hp - damage };

      return { boss: nextBoss, damage, strike: 0, defeated: nextBoss.hp === 0, knockedOut: false, multiplier };
    }

    const knockedOut = activeBoss.playerHp <= BOSS_STRIKE_DAMAGE;
    const nextBoss = {
      ...activeBoss,
      hp: knockedOut ? Math.min(activeBoss.hp + 20, BOSS_MAX_HP) : activeBoss.hp,
      playerHp: knockedOut ? PLAYER_MAX_HP : activeBoss.playerHp - BOSS_STRIKE_DAMAGE
    };

    return { boss: nextBoss, damage: 0, strike: BOSS_STRIKE_DAMAGE, defeated: false, knockedOut, multiplier: 1 };
  }

  const encounters = {
    BOSS_MAX_HP,
    PLAYER_MAX_HP,
    getBossEncounter,
    getBossEncounterState,
    normalizeBoss,
    normalizeBossQueue,
    queueBossMilestones,
    resolveBossAnswer
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = encounters;
  }

  root.QuestiMathBosses = encounters;
}(typeof globalThis !== 'undefined' ? globalThis : window));
