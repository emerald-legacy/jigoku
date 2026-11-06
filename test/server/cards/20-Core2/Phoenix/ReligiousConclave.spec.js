describe('Religious Conclave', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['adept-of-the-waves']
                },
                player2: {
                    dynastyDiscard: ['religious-conclave']
                }
            });

            this.adept = this.player1.findCardByName('adept-of-the-waves');

            this.religiousConclave = this.player2.findCardByName('religious-conclave');
            this.player2.moveCard(this.religiousConclave, 'province 1');

            this.player1.pass();
        });

        it('protects a ring', function () {
            this.player2.clickCard(this.religiousConclave);
            expect(this.player2).toHavePrompt('Choose a ring');

            this.player2.clickRing('fire');
            expect(this.getChatLogs(5)).toContain(
                'player2 uses Religious Conclave, sacrificing Religious Conclave to prevent player1 from declaring a conflict with Fire Ring'
            );

            this.noMoreActions();
            expect(this.player1).toHavePrompt('Initiate Conflict');

            this.player1.clickRing('fire');
            expect(this.game.rings.fire.contested).toBe(false);

            this.player1.clickRing('air');
            expect(this.game.rings.air.contested).toBe(true);
        });
    });
});

describe('Religious Conclave and its own player', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['adept-of-the-waves']
                },
                player2: {
                    inPlay: ['doji-whisperer'],
                    dynastyDiscard: ['religious-conclave']
                }
            });

            this.adept = this.player1.findCardByName('adept-of-the-waves');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.religiousConclave = this.player2.findCardByName('religious-conclave');
            this.player2.moveCard(this.religiousConclave, 'province 1');

            this.player1.pass();
            this.player2.clickCard(this.religiousConclave);
            this.player2.clickRing('fire');
        });

        it('can still declare the chosen ring', function () {
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            expect(this.player2).toHavePrompt('Initiate Conflict');
            this.player2.clickRing('fire');
            expect(this.game.rings.fire.contested).toBe(true);
        });

        it('does not stop the opponent in a later round', function () {
            this.adept.fate = 2;
            this.whisperer.fate = 2;
            this.advancePhases('fate');
            this.advancePhases('conflict');
            expect(this.game.roundNumber).toBe(2);
            this.noMoreActions();
            this.player2.passConflict();
            this.noMoreActions();
            expect(this.player1).toHavePrompt('Initiate Conflict');
            this.player1.clickRing('fire');
            expect(this.game.rings.fire.contested).toBe(true);
        });
    });
});
