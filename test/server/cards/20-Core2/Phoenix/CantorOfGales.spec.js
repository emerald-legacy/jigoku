import { ThenAbility } from '../../../../../build/server/game/ThenAbility.js';
import { cardLastingEffect } from '../../../../../build/server/game/GameActions/GameActions.js';
import { modifyBaseMilitarySkillMultiplier } from '../../../../../build/server/game/effects.js';

describe('Cantor of Gales', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['cantor-of-gales', 'adept-of-the-waves', 'seeker-initiate']
                }
            });
            this.cantor = this.player1.findCardByName('cantor-of-gales');
            this.adeptHonorable = this.player1.findCardByName('adept-of-the-waves');
            this.seekerOrdinary = this.player1.findCardByName('seeker-initiate');

            this.cantor.honor();
            this.adeptHonorable.honor();

            this.noMoreActions();
        });

        it('does nothing without an honorable character', function () {
            this.initiateConflict({
                attackers: [this.seekerOrdinary],
                defenders: [],
                type: 'military'
            });
            expect(this.game.currentConflict.attackerSkill).toBe(1);
        });

        it('contributes base skill from home when controller has honorale char in conflict', function () {
            this.initiateConflict({
                attackers: [this.adeptHonorable],
                defenders: [],
                type: 'military'
            });
            expect(this.game.currentConflict.attackerSkill).toBe(6);
        });

        it('contributes base skill from home when controller has honorale char in conflict, even while bowed', function () {
            this.cantor.bow();

            this.initiateConflict({
                attackers: [this.adeptHonorable],
                defenders: [],
                type: 'military'
            });
            expect(this.game.currentConflict.attackerSkill).toBe(6);
        });

        it('contributes its base skill, not a fixed 2', function () {
            const context = new ThenAbility(this.cantor, {}).createContext(this.player1.player);
            this.game.queueSimpleStep(() => cardLastingEffect({
                duration: 'untilEndOfRound',
                effect: modifyBaseMilitarySkillMultiplier(2)
            }).resolve(this.cantor, context));
            this.game.continue();
            expect(this.cantor.getBaseMilitarySkill()).toBe(4);

            this.initiateConflict({
                attackers: [this.adeptHonorable],
                defenders: [],
                type: 'military'
            });
            expect(this.game.currentConflict.attackerSkill).toBe(8);
        });

        it('does not work while participating', function () {
            this.initiateConflict({
                attackers: [this.cantor, this.adeptHonorable],
                defenders: [],
                type: 'military'
            });
            expect(this.game.currentConflict.attackerSkill).toBe(8);
        });
    });
});
