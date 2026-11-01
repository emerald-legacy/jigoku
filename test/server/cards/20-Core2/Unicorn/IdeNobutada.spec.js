describe('Ide Nobutada', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    hand: ['fine-katana'],
                    inPlay: ['ide-nobutada'],
                    dynastyDiscard: ['shinjo-takame']
                }
            });

            this.fineKatana = this.player1.findCardByName('fine-katana');
            this.ideNobutada = this.player1.findCardByName('ide-nobutada');
            this.shinjoTakame = this.player1.moveCard('shinjo-takame', 'dynasty deck');

            this.ideNobutada.honor();
            this.ideNobutada.modifyFate(1);
            this.player1.playAttachment(this.fineKatana, this.ideNobutada);
            this.player2.pass();
        });

        it('shuffles the dynasty deck when it takes nothing', function () {
            this.player1.clickCard(this.ideNobutada);
            this.player1.clickPrompt('Take nothing');
            expect(this.ideNobutada.location).toBe('play area');
            expect(this.getChatLogs(5)).toContain('player1 finds no copies of Shinjo Takame');
            expect(this.getChatLogs(5)).toContain('player1 is shuffling their dynasty deck');
        });

        it('replaces itself with Shinjo Takame', function () {
            this.player1.clickCard(this.ideNobutada);
            expect(this.player1).toHavePrompt('Find a copy of Shinjo Takame');
            expect(this.player1).toHavePromptButton('Shinjo Takame');

            this.player1.clickPrompt('Shinjo Takame');
            expect(this.ideNobutada.location).toBe('dynasty deck');
            expect(this.shinjoTakame.location).toBe('play area');
            expect(this.shinjoTakame.attachments).toContain(this.fineKatana);
            expect(this.shinjoTakame.fate).toBe(1);
            expect(this.getChatLogs(5)).toContain('player1 replaces Ide Nobutada with Shinjo Takame');
            expect(this.getChatLogs(5)).toContain('player1 is shuffling their dynasty deck');

            this.player1.clickCard(this.shinjoTakame);
            expect(this.player1).not.toHavePrompt('Find a copy of Ide Nobutada');
        });
    });
});

describe('Ide Nobutada while Shinjo Takame is in play', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    hand: ['fine-katana'],
                    inPlay: ['ide-nobutada', 'shinjo-takame'],
                    dynastyDiscard: ['shinjo-takame']
                }
            });
            this.fineKatana = this.player1.findCardByName('fine-katana');
            this.ideNobutada = this.player1.findCardByName('ide-nobutada');
            this.takameInDeck = this.player1.moveCard(this.player1.findCardByName('shinjo-takame', 'dynasty discard pile'), 'dynasty deck');
            this.player1.playAttachment(this.fineKatana, this.ideNobutada);
            this.player2.pass();
        });

        it('cannot choose a copy that can\'t enter play (unique)', function () {
            this.player1.clickCard(this.ideNobutada);
            expect(this.player1).not.toHavePromptButton('Shinjo Takame');
            this.player1.clickPrompt('Take nothing');
            expect(this.ideNobutada.location).toBe('play area');
            expect(this.ideNobutada.attachments).toContain(this.fineKatana);
            expect(this.takameInDeck.location).toBe('dynasty deck');
        });
    });
});

describe('Shinjo Takame put into play by Ide Nobutada, with an opposing Shosuro Deceiver', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['ide-nobutada'],
                    dynastyDiscard: ['shinjo-takame']
                },
                player2: {
                    inPlay: ['shosuro-deceiver']
                }
            });
            this.ideNobutada = this.player1.findCardByName('ide-nobutada');
            this.shinjoTakame = this.player1.moveCard('shinjo-takame', 'dynasty deck');
            this.deceiver = this.player2.findCardByName('shosuro-deceiver');
            this.ideNobutada.dishonor();

            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.ideNobutada],
                defenders: [this.deceiver]
            });
            this.player2.pass();
            this.player1.clickCard(this.ideNobutada);
            this.player1.clickPrompt('Shinjo Takame');
        });

        it('should let the opponent\'s Shosuro Deceiver trigger the gained Action', function () {
            expect(this.shinjoTakame.isParticipating()).toBe(true);
            expect(this.shinjoTakame.isDishonored).toBe(true);
            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player2.clickCard(this.deceiver);
            expect(this.player2).toHavePrompt('Find a copy of Ide Nobutada');
        });

        it('should still stop player1 from triggering Takame\'s printed Action', function () {
            this.player2.pass();
            this.player1.clickCard(this.shinjoTakame);
            expect(this.player1).not.toHavePrompt('Find a copy of Ide Nobutada');
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });
    });
});
