describe('Greater Understanding 2', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['togashi-yokuni'],
                    hand: ['greater-understanding-2', 'let-go']
                },
                player2: {
                    stronghold: 'temple-of-the-fivefold-path',
                    hand: ['disarm']
                }
            });

            this.greaterUnderstanding = this.player1.findCardByName('greater-understanding-2');
            this.togashiYokuni = this.player1.findCardByName('togashi-yokuni');
            this.togashiYokuni.fate = 1;
            this.togashiYokuni.bow();

            this.t5p = this.player2.findCardByName('temple-of-the-fivefold-path');
            this.disarm = this.player2.findCardByName('disarm');

            this.game.rings.air.fate = 2;
            this.game.rings.earth.fate = 1;
            this.game.rings.fire.fate = 0;
            this.game.rings.void.fate = 0;
            this.game.rings.water.fate = 0;
        });

        it('resolve a ring effect then moves to another ring', function () {
            this.player1.clickCard(this.greaterUnderstanding);
            this.player1.clickRing('fire');

            this.player2.clickCard(this.t5p);
            this.player2.clickPrompt('Place fate on a ring without fate');
            this.player2.clickRing('fire');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.greaterUnderstanding);

            this.player1.clickCard(this.greaterUnderstanding);
            expect(this.getChatLogs(5)).toContain('player1 uses Greater Understanding to resolve Fire Ring effect');

            this.player1.clickCard(this.togashiYokuni);
            this.player1.clickPrompt('Honor Togashi Yokuni');
            expect(this.player2).toHavePrompt('Choose a ring to attach Greater Understanding');
            this.player2.clickRing('void');
            expect(this.getChatLogs(5)).toContain(
                'player2 moves Greater Understanding to Void Ring - enlightenment is elusive'
            );
        });

        it('cannot be targeted by its controller\'s other card abilities either', function () {
            this.player1.clickCard(this.greaterUnderstanding);
            this.player1.clickRing('fire');
            this.player2.pass();

            const letGo = this.player1.findCardByName('let-go');
            this.player1.clickCard(letGo);
            expect(this.player1).toHavePrompt('Initiate an action');
            expect(letGo.location).toBe('hand');
        });

        it('cannot be targeted by opponent card abilities such as Disarm', function () {
            this.player1.clickCard(this.greaterUnderstanding);
            this.player1.clickRing('fire');

            this.player2.clickCard(this.disarm);
            expect(this.player2).not.toBeAbleToSelect(this.greaterUnderstanding);
        });

        it('resolve a ring effect then stays on same ring if no targets to move', function () {
            this.game.rings.void.fate = 1;
            this.game.rings.water.fate = 1;

            this.player1.clickCard(this.greaterUnderstanding);
            this.player1.clickRing('fire');

            this.player2.clickCard(this.t5p);
            this.player2.clickPrompt('Place fate on a ring without fate');
            this.player2.clickRing('fire');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.greaterUnderstanding);

            this.player1.clickCard(this.greaterUnderstanding);
            expect(this.getChatLogs(5)).toContain('player1 uses Greater Understanding to resolve Fire Ring effect');

            this.player1.clickCard(this.togashiYokuni);
            this.player1.clickPrompt('Honor Togashi Yokuni');
            expect(this.player2).not.toHavePrompt('Choose a ring to attach Greater Understanding');
            expect(this.player1).toHavePrompt('Action Window');
        });
    });
});

describe('Greater Understanding 2 and a cancelled ring effect', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['togashi-yokuni'],
                    hand: ['greater-understanding-2']
                },
                player2: {
                    stronghold: 'temple-of-the-fivefold-path',
                    provinces: ['manicured-garden'],
                    dynastyDiscard: ['storm-from-sakkaku']
                }
            });
            this.greaterUnderstanding = this.player1.findCardByName('greater-understanding-2');
            this.togashiYokuni = this.player1.findCardByName('togashi-yokuni');
            this.t5p = this.player2.findCardByName('temple-of-the-fivefold-path');
            this.storm = this.player2.findCardByName('storm-from-sakkaku');
            this.garden = this.player2.findCardByName('manicured-garden');
            this.player2.placeCardInProvince(this.storm, this.garden.location);
            this.storm.facedown = false;
            this.game.rings.fire.fate = 0;

            this.player1.clickCard(this.greaterUnderstanding);
            this.player1.clickRing('fire');
            this.noMoreActions();
            this.initiateConflict({
                ring: 'air',
                province: this.garden,
                attackers: [this.togashiYokuni],
                defenders: []
            });
        });

        it('stays on the ring when Storm from Sakkaku cancels the ring effect', function () {
            this.player2.clickCard(this.t5p);
            this.player2.clickRing('fire');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            this.player1.clickCard(this.greaterUnderstanding);
            expect(this.player2).not.toHavePrompt('Choose a ring to attach Greater Understanding');
            expect(this.greaterUnderstanding.parent).toBe(this.game.rings.fire);
        });
    });
});
