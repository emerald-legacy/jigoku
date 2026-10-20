describe('Obligations of Hospitality', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 12,
                    inPlay: ['kakita-yoshi'],
                    hand: ['obligations-of-hospitality']
                },
                player2: {
                    honor: 8,
                    inPlay: ['brash-samurai', 'doji-whisperer']
                }
            });
            this.yoshi = this.player1.findCardByName('kakita-yoshi');
            this.brash = this.player2.findCardByName('brash-samurai');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.yoshi],
                defenders: [this.brash]
            });
            this.player2.pass();
        });

        it('chooses only a character on the enemy side', function () {
            this.player1.clickCard('obligations-of-hospitality');
            expect(this.player1).toBeAbleToSelect(this.brash);
            expect(this.player1).not.toBeAbleToSelect(this.whisperer);
        });
    });
});

describe('Obligations of Hospitality and The Mirror\'s Gaze', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 12,
                    inPlay: ['kakita-yoshi', 'brash-samurai'],
                    hand: ['obligations-of-hospitality']
                },
                player2: {
                    honor: 8,
                    inPlay: [{ card: 'isawa-ujina', attachments: ['the-mirror-s-gaze'] }, 'doji-whisperer']
                }
            });
            this.yoshi = this.player1.findCardByName('kakita-yoshi');
            this.brash = this.player1.findCardByName('brash-samurai');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.mirror = this.player2.findCardByName('the-mirror-s-gaze');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.yoshi, this.brash],
                defenders: [this.whisperer]
            });
            this.player2.pass();
        });

        it('can be copied by a less honorable player: "If" is a triggering condition (ruling #375)', function () {
            this.player1.clickCard('obligations-of-hospitality');
            this.player1.clickCard(this.whisperer);
            expect(this.whisperer.controller).toBe(this.player1.player);
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.mirror);
            this.player2.clickCard(this.mirror);
            this.player2.clickCard(this.brash);
            expect(this.brash.controller).toBe(this.player2.player);
        });
    });
});
