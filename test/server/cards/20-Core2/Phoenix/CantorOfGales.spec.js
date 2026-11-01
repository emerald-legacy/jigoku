import { ResolvableAbility } from '../../../../../build/server/game/ResolvableAbility.js';
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
            const context = new ResolvableAbility(this.cantor, {}).createContext(this.player1.player);
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

describe('Cantor of Gales\'s ability gained through Contemplative Wisdom', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: [{ card: 'cantor-of-gales', attachments: ['contemplative-wisdom'] }, 'adept-of-the-waves', 'doji-challenger'],
                    hand: ['retreat']
                },
                player2: {
                    inPlay: ['solemn-scholar']
                }
            });
            this.cantor = this.player1.findCardByName('cantor-of-gales');
            this.adept = this.player1.findCardByName('adept-of-the-waves');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.adept.honor();
            this.player1.claimRing('air');
        });

        it('contributes the base skill of the character that gained it', function () {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.adept, this.challenger],
                defenders: [],
                ring: 'fire'
            });
            this.player2.pass();
            this.player1.clickCard(this.cantor);
            this.player1.clickCard(this.challenger);
            this.player1.clickRing('air');
            this.player2.pass();
            this.player1.clickCard('retreat');
            this.player1.clickCard(this.challenger);
            expect(this.challenger.isParticipating()).toBe(false);
            expect(this.game.currentConflict.attackerSkill).toBe(
                this.adept.militarySkill + this.cantor.getBaseMilitarySkill() + this.challenger.getBaseMilitarySkill()
            );
        });
    });
});
