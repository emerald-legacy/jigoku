import { ResolvableAbility } from '../../../../build/server/game/ResolvableAbility.js';
import { breakProvince } from '../../../../build/server/game/GameActions/GameActions.js';

describe('Repentant Legion', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['repentant-legion', 'hida-kisada'],
                    dynastyDiscard: ['doji-whisperer', 'matsu-berserker', 'miya-mystic', 'imperial-storehouse']
                },
                player2: {
                    inPlay: ['doji-challenger']
                }
            });

            this.repentantLegion = this.player1.findCardByName('repentant-legion');
            this.kisada = this.player1.findCardByName('hida-kisada');

            this.dojiWhisperer = this.player1.moveCard('doji-whisperer', 'dynasty deck');
            this.matsuBerserker = this.player1.moveCard('matsu-berserker', 'dynasty deck');
            this.miyaMystic = this.player1.moveCard('miya-mystic', 'dynasty deck');
            this.storehouse = this.player1.moveCard('imperial-storehouse', 'dynasty deck');

            this.dojiChallenger = this.player2.findCardByName('doji-challenger');
        });

        it('should trigger on breaking an enemy province', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.repentantLegion],
                defenders: [],
                type: 'military'
            });

            this.noMoreActions();

            this.player1.clickPrompt('no');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.repentantLegion);
        });

        it('should not trigger on breaking an enemy province while not participating', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.kisada],
                defenders: [],
                type: 'military'
            });

            this.noMoreActions();

            this.player1.clickPrompt('no');
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player1).not.toBeAbleToSelect(this.repentantLegion);
            expect(this.player1).toHavePrompt('air ring');
        });

        it('should not trigger on breaking an friendly province', function() {
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.dojiChallenger],
                defenders: [this.repentantLegion],
                type: 'military'
            });

            this.repentantLegion.bowed = true;
            this.noMoreActions();

            this.player2.clickPrompt('no');
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player1).not.toBeAbleToSelect(this.repentantLegion);
            expect(this.player2).toHavePrompt('air ring');
        });

        it('should trigger when the attacker\'s own province breaks while it defends, as its player broke it', function() {
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.dojiChallenger],
                defenders: [this.repentantLegion],
                type: 'military'
            });

            const attackersProvince = this.player2.findCardByName('shameful-display', 'province 1');
            const context = new ResolvableAbility(this.dojiChallenger, {}).createContext(this.player2.player);
            this.game.queueSimpleStep(() => breakProvince().resolve(attackersProvince, context));
            this.game.continue();
            this.player2.clickPrompt('No');
            expect(attackersProvince.isBroken).toBe(true);
            expect(this.player1).toBeAbleToSelect(this.repentantLegion);
        });

        it('should put a card in each non-stronghold rovince facedown', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.repentantLegion],
                defenders: [],
                type: 'military'
            });

            this.noMoreActions();

            this.player1.clickPrompt('no');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.repentantLegion);

            this.player1.clickCard(this.repentantLegion);

            expect(this.dojiWhisperer.location).toBe('province 4');
            expect(this.matsuBerserker.location).toBe('province 3');
            expect(this.miyaMystic.location).toBe('province 2');
            expect(this.storehouse.location).toBe('province 1');

            expect(this.dojiWhisperer.facedown).toBe(true);
            expect(this.matsuBerserker.facedown).toBe(true);
            expect(this.miyaMystic.facedown).toBe(true);
            expect(this.storehouse.facedown).toBe(true);
        });

        it('should keep filling after the dynasty deck runs out', function() {
            this.player1.reduceDeckToNumber('dynasty deck', 2);
            const honor = this.player1.honor;
            const inProvince3 = this.player1.player.getDynastyCardsInProvince('province 3').length;
            const inProvince4 = this.player1.player.getDynastyCardsInProvince('province 4').length;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.repentantLegion],
                defenders: [],
                type: 'military'
            });

            this.noMoreActions();

            this.player1.clickPrompt('no');
            this.player1.clickCard(this.repentantLegion);

            expect(this.storehouse.location).toBe('province 1');
            expect(this.miyaMystic.location).toBe('province 2');
            expect(this.player1.honor).toBe(honor - 5);
            expect(this.player1.player.getDynastyCardsInProvince('province 3').length).toBe(inProvince3 + 1);
            expect(this.player1.player.getDynastyCardsInProvince('province 4').length).toBe(inProvince4 + 1);
        });
    });
});
