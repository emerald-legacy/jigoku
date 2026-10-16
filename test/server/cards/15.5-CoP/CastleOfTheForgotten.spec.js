import { ThenAbility } from '../../../../build/server/game/ThenAbility.js';
import { breakProvince } from '../../../../build/server/game/GameActions/GameActions.js';

describe('Castle of the Forgotten', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['akodo-gunso', 'akodo-kage'],
                    hand: ['suffer-the-consequences'],
                    stronghold: ['castle-of-the-forgotten']
                },
                player2: {
                    inPlay: ['border-rider', 'moto-horde']
                }
            });
            this.castle = this.player1.findCardByName('castle-of-the-forgotten');
            this.akodoGunso = this.player1.findCardByName('akodo-gunso');
            this.akodoKage = this.player1.findCardByName('akodo-kage');
            this.suffer = this.player1.findCardByName('suffer-the-consequences');

            this.borderRider = this.player2.findCardByName('border-rider');
            this.motoHorde = this.player2.findCardByName('moto-horde');
        });

        it('should trigger when a province is broken', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.akodoGunso, this.akodoKage],
                defenders: [],
                type: 'military'
            });
            this.noMoreActions();
            this.player1.clickPrompt('No');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.castle);
        });

        it('should set all future conflicts to be military', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.akodoGunso, this.akodoKage],
                defenders: [],
                type: 'military'
            });
            this.noMoreActions();
            this.player1.clickPrompt('No');
            this.player1.clickCard(this.castle);
            expect(this.player1.player.getRemainingConflictOpportunitiesForType('military')).toBe(1);
            expect(this.player1.player.getRemainingConflictOpportunitiesForType('political')).toBe(0);
            expect(this.player1.player.getConflictOpportunities()).toBe(1);
            expect(this.player2.player.getRemainingConflictOpportunitiesForType('military')).toBe(2);
            expect(this.player2.player.getRemainingConflictOpportunitiesForType('political')).toBe(0);
            expect(this.player2.player.getConflictOpportunities()).toBe(2);

            expect(this.getChatLogs(5)).toContain('player1 uses Castle of the Forgotten, bowing Castle of the Forgotten to make all future conflicts military for this phase');
        });

        it('should make all added conflicts be military', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.akodoGunso, this.akodoKage],
                defenders: [],
                type: 'military'
            });
            this.noMoreActions();
            this.player1.clickPrompt('No');
            this.player1.clickCard(this.castle);
            this.player1.clickPrompt('Don\'t Resolve');
            this.player1.clickCard(this.suffer);
            this.player1.clickCard(this.akodoGunso);

            expect(this.player1.player.getRemainingConflictOpportunitiesForType('military')).toBe(2);
            expect(this.player1.player.getRemainingConflictOpportunitiesForType('political')).toBe(0);
            expect(this.player1.player.getConflictOpportunities()).toBe(2);
            expect(this.player2.player.getRemainingConflictOpportunitiesForType('military')).toBe(2);
            expect(this.player2.player.getRemainingConflictOpportunitiesForType('political')).toBe(0);
            expect(this.player2.player.getConflictOpportunities()).toBe(2);
        });

        it('should work properly with conflict counting', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.akodoGunso, this.akodoKage],
                defenders: [],
                type: 'military'
            });
            this.noMoreActions();
            this.player1.clickPrompt('No');
            this.player1.clickCard(this.castle);
            this.player1.clickPrompt('Don\'t Resolve');

            expect(this.player1.player.getRemainingConflictOpportunitiesForType('military')).toBe(1);
            expect(this.player1.player.getRemainingConflictOpportunitiesForType('political')).toBe(0);
            expect(this.player1.player.getConflictOpportunities()).toBe(1);
            expect(this.player2.player.getRemainingConflictOpportunitiesForType('military')).toBe(2);
            expect(this.player2.player.getRemainingConflictOpportunitiesForType('political')).toBe(0);
            expect(this.player2.player.getConflictOpportunities()).toBe(2);

            this.noMoreActions();
            this.player2.passConflict();
            expect(this.player2.player.getRemainingConflictOpportunitiesForType('military')).toBe(2);
            expect(this.player2.player.getRemainingConflictOpportunitiesForType('political')).toBe(0);
            expect(this.player2.player.getConflictOpportunities()).toBe(1);
        });
    });
});

describe('Castle of the Forgotten other breaks', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    stronghold: ['castle-of-the-forgotten']
                },
                player2: {
                    inPlay: ['border-rider']
                }
            });
            this.castle = this.player1.findCardByName('castle-of-the-forgotten');
            this.rider = this.player2.findCardByName('border-rider');
            this.opponentsProvince = this.player2.findCardByName('shameful-display', 'province 1');
        });

        it('reacts when the opponent\'s province breaks outside a conflict, as you broke it', function() {
            const context = new ThenAbility(this.rider, {}).createContext(this.player2.player);
            this.game.queueSimpleStep(() => breakProvince().resolve(this.opponentsProvince, context));
            this.game.continue();
            expect(this.opponentsProvince.isBroken).toBe(true);
            expect(this.player1).toBeAbleToSelect(this.castle);
        });

        it('does not react when your own province breaks', function() {
            const ownProvince = this.player1.findCardByName('shameful-display', 'province 1');
            const context = new ThenAbility(this.rider, {}).createContext(this.player2.player);
            this.game.queueSimpleStep(() => breakProvince().resolve(ownProvince, context));
            this.game.continue();
            expect(ownProvince.isBroken).toBe(true);
            expect(this.player1).not.toBeAbleToSelect(this.castle);
        });
    });
});
