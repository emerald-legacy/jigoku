describe('Shinjo Saddle', function() {
    integration(function() {
        describe('Shinjo Saddle\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shinjo-outrider', 'miya-mystic', 'border-rider'],
                        hand: ['shinjo-saddle']
                    },
                    player2: {
                        inPlay: ['border-rider']
                    }
                });
                this.outrider = this.player1.findCardByName('shinjo-outrider');
                this.miyaMystic = this.player1.findCardByName('miya-mystic');
                this.borderRider = this.player1.findCardByName('border-rider');
                this.saddle = this.player1.playAttachment('shinjo-saddle', this.outrider);
            });

            it('should only be targetable to cavalry characters when moved', function() {
                this.player2.pass();
                this.player1.clickCard(this.saddle);
                expect(this.player1).toBeAbleToSelect(this.borderRider);
                expect(this.player1).not.toBeAbleToSelect(this.miyaMystic);
                // not where it already is (RRG Move)
                expect(this.player1).not.toBeAbleToSelect(this.outrider);
            });

            it('should move to another cavalry character', function() {
                this.player2.pass();
                this.player1.clickCard(this.saddle);
                this.player1.clickCard(this.borderRider);
                expect(this.borderRider.attachments).toContain(this.saddle);
            });
        });
    });
});

describe('Shinjo Saddle on an opponent\'s character', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['miya-mystic'],
                    hand: ['shinjo-saddle']
                },
                player2: {
                    inPlay: ['border-rider']
                }
            });
            this.miyaMystic = this.player1.findCardByName('miya-mystic');
            this.borderRider = this.player2.findCardByName('border-rider');
        });

        it('can be played on an opponent\'s Cavalry character', function() {
            this.player1.clickCard('shinjo-saddle');
            expect(this.player1).toBeAbleToSelect(this.borderRider);
            expect(this.player1).not.toBeAbleToSelect(this.miyaMystic);
            this.player1.clickCard(this.borderRider);
            expect(this.borderRider.attachments).toContain(this.player1.findCardByName('shinjo-saddle'));
        });
    });
});
