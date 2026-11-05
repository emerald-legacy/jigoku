describe('Raving Lunatic', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['raving-lunatic', 'doji-challenger']
                },
                player2: {
                    inPlay: ['raving-lunatic']
                }
            });
            this.lunatic = this.player1.findCardByName('raving-lunatic');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.lunatic2 = this.player2.findCardByName('raving-lunatic');
            this.challenger.fate = 4;
            this.player1.player.showBid = 5;
            this.player2.player.showBid = 2;
        });

        it('happy path', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.lunatic2]
            });

            expect(this.lunatic.militarySkill).toBe(this.lunatic2.militarySkill + 2);
            expect(this.lunatic.politicalSkill).toBe(this.lunatic2.politicalSkill);

            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player2.clickCard(this.lunatic2);
            expect(this.player2).toBeAbleToSelect(this.challenger);
            expect(this.player2).not.toBeAbleToSelect(this.lunatic);
            expect(this.player2).not.toBeAbleToSelect(this.lunatic2);

            this.player2.clickCard(this.challenger);

            expect(this.lunatic2.location).toBe('dynasty discard pile');
            expect(this.challenger.fate).toBe(3);

            expect(this.getChatLogs(5)).toContain('player2 uses Raving Lunatic to injure Doji Challenger and Raving Lunatic');
        });
    });
});

describe('Raving Lunatic with characters on the other side than their controller', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['raving-lunatic', 'doji-challenger', 'endless-plains-skirmisher']
                },
                player2: {
                    inPlay: ['doji-whisperer', 'endless-plains-skirmisher']
                }
            });
            this.lunatic = this.player1.findCardByName('raving-lunatic');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.skirmisher1 = this.player1.findCardByName('endless-plains-skirmisher');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.skirmisher2 = this.player2.findCardByName('endless-plains-skirmisher');
            this.player2.player.showBid = 1;

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.lunatic, this.challenger],
                defenders: [this.whisperer]
            });
            this.player2.clickCard(this.skirmisher2);
            this.player2.clickPrompt('player1');
            this.player1.clickCard(this.skirmisher1);
            this.player1.clickPrompt('player2');
            this.player2.pass();
        });

        it('chooses a character on the enemy side, whoever controls it', function () {
            expect(this.game.currentConflict.attackers).toContain(this.skirmisher2);
            expect(this.game.currentConflict.defenders).toContain(this.skirmisher1);

            this.player1.clickCard(this.lunatic);
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            expect(this.player1).toBeAbleToSelect(this.skirmisher1);
            expect(this.player1).not.toBeAbleToSelect(this.skirmisher2);

            this.player1.clickCard(this.skirmisher1);
            expect(this.getChatLogs(5)).toContain('player1 uses Raving Lunatic to injure Endless Plains Skirmisher and Raving Lunatic');
        });
    });
});
