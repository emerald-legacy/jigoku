describe('Soshi Yuka', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['soshi-yuka']
                },
                player2: {
                    inPlay: ['doji-challenger', 'doji-hotaru', 'doji-whisperer', 'brash-samurai']
                }
            });
            this.soshiYuka = this.player1.findCardByName('soshi-yuka');
            this.dojiChallenger = this.player2.findCardByName('doji-challenger');
            this.hotaru = this.player2.findCardByName('doji-hotaru');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.brashSamurai = this.player2.findCardByName('brash-samurai');

            this.hotaru.bow();
        });

        it('bows a character out of 2 options', function () {
            this.player1.clickCard(this.soshiYuka);
            expect(this.player2).toHavePrompt('Choose 2 characters');
            expect(this.player2).toBeAbleToSelect(this.dojiChallenger);
            expect(this.player2).toBeAbleToSelect(this.whisperer);
            expect(this.player2).toBeAbleToSelect(this.brashSamurai);
            expect(this.player2).not.toBeAbleToSelect(this.hotaru);
            this.player2.clickCard(this.dojiChallenger);
            this.player2.clickCard(this.whisperer);
            this.player2.clickPrompt('Done');

            expect(this.player1).toHavePrompt('Choose a character');
            expect(this.player1).toBeAbleToSelect(this.dojiChallenger);
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            expect(this.player1).not.toBeAbleToSelect(this.brashSamurai);
            expect(this.player1).not.toBeAbleToSelect(this.hotaru);
            this.player1.clickCard(this.dojiChallenger);
            expect(this.getChatLogs(5)).toContain(
                'player1 uses Soshi Yuka to sow discord between Doji Challenger and Doji Whisperer'
            );
            expect(this.getChatLogs(5)).toContain(
                'Doji Challenger is bowed, as they are dragged into a web of intrigue'
            );
        });
    });
});

describe('Soshi Yuka and a character that cannot be bowed', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['soshi-yuka', 'doji-whisperer']
                },
                player2: {
                    inPlay: ['borderlands-defender', 'doji-challenger', 'brash-samurai']
                }
            });
            this.yuka = this.player1.findCardByName('soshi-yuka');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.defender = this.player2.findCardByName('borderlands-defender');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.brashSamurai = this.player2.findCardByName('brash-samurai');

            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.whisperer],
                defenders: [this.defender]
            });
            this.player2.pass();
        });

        it('should not let the opponent choose the defending Borderlands Defender', function () {
            this.player1.clickCard(this.yuka);
            expect(this.player2).toHavePrompt('Choose 2 characters');
            expect(this.player2).toBeAbleToSelect(this.challenger);
            expect(this.player2).toBeAbleToSelect(this.brashSamurai);
            expect(this.player2).not.toBeAbleToSelect(this.defender);
        });
    });
});
