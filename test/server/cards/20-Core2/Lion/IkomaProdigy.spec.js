describe('Ikoma Prodigy', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'dynasty',
                player1: {
                    fate: 5,
                    honor: 10,
                    dynastyDiscard: ['ikoma-prodigy']
                }
            });
            this.prodigy = this.player1.placeCardInProvince('ikoma-prodigy', 'province 1');
        });

        it('gains 1 honor after it enters play with fate placed on it', function() {
            this.player1.clickCard(this.prodigy);
            this.player1.clickPrompt('1');
            expect(this.prodigy.fate).toBe(1);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            this.player1.clickCard(this.prodigy);

            expect(this.player1.honor).toBe(11);
            expect(this.getChatLogs(3)).toContain('player1 uses Ikoma Prodigy to gain 1 honor');
        });

        it('does not react when it enters play without fate', function() {
            this.player1.clickCard(this.prodigy);
            this.player1.clickPrompt('0');

            expect(this.prodigy.location).toBe('play area');
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player2).toHavePrompt('Play cards from provinces');
            expect(this.player1.honor).toBe(10);
        });
    });
});

describe('Ikoma Prodigy and moved fate', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 10,
                    inPlay: [{ card: 'doji-challenger', fate: 2, attachments: ['command-the-tributary'] }, 'ikoma-prodigy']
                }
            });
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.prodigy = this.player1.findCardByName('ikoma-prodigy');
        });

        // ruling #1071: Ikoma Prodigy can be triggered after fate is moved to the character
        it('gains 1 honor after fate is moved to it', function() {
            this.player1.clickCard(this.challenger);
            this.player1.clickCard(this.prodigy);
            expect(this.prodigy.fate).toBe(1);
            expect(this.challenger.fate).toBe(1);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            this.player1.clickCard(this.prodigy);

            expect(this.player1.honor).toBe(11);
        });
    });
});
