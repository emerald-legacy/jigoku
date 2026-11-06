describe('Eminent Historian', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 10,
                    inPlay: ['eminent-historian', 'brash-samurai', 'doji-challenger']
                },
                player2: {
                    honor: 10,
                    inPlay: ['kakita-asami'],
                    hand: ['way-of-the-scorpion']
                }
            });

            this.historian = this.player1.findCardByName('eminent-historian');
            this.brashSamurai = this.player1.findCardByName('brash-samurai');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.asami = this.player2.findCardByName('kakita-asami');
            this.wayOfTheScorpion = this.player2.findCardByName('way-of-the-scorpion');
        });

        it('should honor a participating character on your side, even from home', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.brashSamurai],
                defenders: [this.asami]
            });
            this.player2.pass();
            this.player1.clickCard(this.historian);
            expect(this.player1).toHavePrompt('Eminent Historian');
            expect(this.player1).toBeAbleToSelect(this.brashSamurai);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
            expect(this.player1).not.toBeAbleToSelect(this.historian);
            expect(this.player1).not.toBeAbleToSelect(this.asami);
            this.player1.clickCard(this.brashSamurai);
            expect(this.brashSamurai.isHonored).toBe(true);
            expect(this.getChatLogs(3)).toContain('player1 uses Eminent Historian to honor Brash Samurai');
        });

        it('should not be usable if an opponent is more honorable', function() {
            this.player2.honor = 11;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.brashSamurai],
                defenders: [this.asami]
            });
            this.player2.pass();
            this.player1.clickCard(this.historian);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.brashSamurai.isHonored).toBe(false);
        });

        it('should not be able to receive dishonored status tokens', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.historian, this.brashSamurai],
                defenders: [this.asami]
            });
            this.player2.clickCard(this.wayOfTheScorpion);
            expect(this.player2).toBeAbleToSelect(this.brashSamurai);
            expect(this.player2).not.toBeAbleToSelect(this.historian);
        });
    });
});

describe('Eminent Historian with characters on the other side than their controller', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 10,
                    inPlay: ['eminent-historian', 'doji-whisperer', 'endless-plains-skirmisher']
                },
                player2: {
                    honor: 10,
                    inPlay: ['solemn-scholar', 'endless-plains-skirmisher']
                }
            });
            this.historian = this.player1.findCardByName('eminent-historian');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.skirmisher1 = this.player1.findCardByName('endless-plains-skirmisher');
            this.scholar = this.player2.findCardByName('solemn-scholar');
            this.skirmisher2 = this.player2.findCardByName('endless-plains-skirmisher');

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.whisperer],
                defenders: [this.scholar]
            });
            this.player2.clickCard(this.skirmisher2);
            this.player2.clickPrompt('player1');
            this.player1.clickCard(this.skirmisher1);
            this.player1.clickPrompt('player2');
        });

        it('chooses a character on your side, whoever controls it', function() {
            this.player2.pass();
            expect(this.game.currentConflict.attackers).toContain(this.skirmisher2);
            expect(this.game.currentConflict.defenders).toContain(this.skirmisher1);

            this.player1.clickCard(this.historian);
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            expect(this.player1).toBeAbleToSelect(this.skirmisher2);
            expect(this.player1).not.toBeAbleToSelect(this.skirmisher1);
            this.player1.clickCard(this.skirmisher2);
            expect(this.skirmisher2.isHonored).toBe(true);
        });
    });
});
