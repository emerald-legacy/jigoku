import { gainAbility } from '../../../build/server/game/effects.js';

describe('Gained abilities', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: [
                        { card: 'kakita-asami', attachments: ['truth-burns-through-lies'] },
                        { card: 'doji-whisperer', attachments: ['collector-of-favors'] }
                    ]
                },
                player2: {
                    inPlay: ['bayushi-liar']
                }
            });
            this.asami = this.player1.findCardByName('kakita-asami');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.liar = this.player2.findCardByName('bayushi-liar');
        });

        describe('a gained Conflict Action', function() {
            it('cannot be used outside a conflict', function() {
                this.player1.clickCard(this.asami);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('cannot be used by a character at home', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.whisperer],
                    defenders: [this.liar]
                });
                this.player2.pass();
                this.player1.clickCard(this.asami);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('can be used by a participating character', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.asami],
                    defenders: [this.liar]
                });
                this.player2.pass();
                this.player1.clickCard(this.asami);
                expect(this.player1).toBeAbleToSelect(this.liar);
                this.player1.clickCard(this.liar);
                expect(this.liar.isDishonored).toBe(true);
            });
        });

        it('gives a gained reaction its when()', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.whisperer],
                defenders: []
            });
            this.noMoreActions();
            expect(this.player1).toHavePrompt('Triggered Abilities');
            const fate = this.player1.fate;
            this.player1.clickCard(this.whisperer);
            expect(this.player1.fate).toBe(fate + 1);
        });

        it('rejects a gained trigger without when()', function() {
            expect(() => gainAbility.reaction('Test', (ability) => ability)).toThrowError('Test: a gained trigger starts with when() or aggregateWhen()');
        });
    });
});
