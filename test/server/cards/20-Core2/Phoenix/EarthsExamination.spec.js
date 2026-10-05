describe('Earth\'s Examination', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['prodigy-of-the-waves', 'kaito-kosori', 'keeper-initiate']
                },
                player2: {
                    hand: ['earth-s-examination'],
                    inPlay: ['adept-of-the-waves', 'solemn-scholar']
                }
            });

            this.keeper = this.player1.findCardByName('keeper-initiate');
            this.prodigy = this.player1.findCardByName('prodigy-of-the-waves');
            this.kosoriTainted = this.player1.findCardByName('kaito-kosori');
            this.kosoriTainted.taint();

            this.examination = this.player2.findCardByName('earth-s-examination');
            this.adept = this.player2.findCardByName('adept-of-the-waves');
            this.solemn = this.player2.findCardByName('solemn-scholar');

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.prodigy, this.kosoriTainted],
                defenders: [this.adept],
                type: 'political'
            });
        });

        describe('without affinity', function () {
            beforeEach(function () {
                this.player2.moveCard(this.solemn, 'dynasty discard pile');
            });

            it('taints a participating character', function () {
                this.player2.clickCard(this.examination);
                expect(this.player2).toHavePrompt('Choose a character');
                expect(this.player2).toBeAbleToSelect(this.prodigy);
                expect(this.player2).not.toBeAbleToSelect(this.kosoriTainted);
                expect(this.player2).toBeAbleToSelect(this.adept);
                expect(this.player2).not.toBeAbleToSelect(this.keeper);

                this.player2.clickCard(this.prodigy);
                expect(this.player2).not.toHavePrompt('Bow that character?');
                expect(this.prodigy.isTainted).toBe(true);
                expect(this.getChatLogs(5)).toContain(
                    'player2 plays Earth\'s Examination to reveal Prodigy of the Waves\'s corruption'
                );
            });

            it('cannot be used on a tainted character', function () {
                this.prodigy.taint();
                this.player2.clickCard(this.prodigy);

                this.player2.clickCard(this.examination);
                expect(this.player2).toHavePrompt('Choose a character');
                expect(this.player2).not.toBeAbleToSelect(this.prodigy);
                expect(this.player2).not.toBeAbleToSelect(this.kosoriTainted);
                expect(this.player2).toBeAbleToSelect(this.adept);
                expect(this.player2).not.toBeAbleToSelect(this.keeper);
            });
        });
        describe('with affinity', function () {
            it('taints a participating character', function () {
                this.player2.clickCard(this.examination);
                expect(this.player2).toHavePrompt('Choose a character');
                expect(this.player2).toBeAbleToSelect(this.prodigy);
                expect(this.player2).toBeAbleToSelect(this.kosoriTainted);
                expect(this.player2).toBeAbleToSelect(this.adept);
                expect(this.player2).not.toBeAbleToSelect(this.keeper);
                expect(this.player2).not.toBeAbleToSelect(this.solemn);

                this.player2.clickCard(this.prodigy);
                expect(this.player2).toHavePrompt('Bow that character?');
                expect(this.player2).toHavePromptButton('Yes');
                expect(this.player2).toHavePromptButton('No');

                this.player2.clickPrompt('No');
                expect(this.prodigy.isTainted).toBe(true);
                expect(this.getChatLogs(5)).toContain(
                    'player2 plays Earth\'s Examination to reveal Prodigy of the Waves\'s corruption'
                );
            });

            it('taints and bow a participating character', function () {
                this.player2.clickCard(this.examination);
                this.player2.clickCard(this.prodigy);
                expect(this.player2).toHavePrompt('Bow that character?');
                expect(this.player2).toHavePromptButton('Yes');
                expect(this.player2).toHavePromptButton('No');

                this.player2.clickPrompt('Yes');
                expect(this.prodigy.bowed).toBe(true);
                expect(this.getChatLogs(5)).toContain(
                    'player2 channels their earth affinity to bow Prodigy of the Waves'
                );
            });

            it('bows a target that is already tainted', function () {
                this.prodigy.taint();

                this.player2.clickCard(this.examination);
                this.player2.clickCard(this.prodigy);
                expect(this.player2).not.toHavePrompt('Bow that character?');
                expect(this.prodigy.isTainted).toBe(true);
                expect(this.prodigy.bowed).toBe(true);
                expect(this.getChatLogs(5)).toContain(
                    'player2 plays Earth\'s Examination to reveal Prodigy of the Waves\'s corruption'
                );

                expect(this.getChatLogs(5)).toContain(
                    'player2 channels their earth affinity to bow Prodigy of the Waves'
                );
            });
        });
    });
});

describe('Earth\'s Examination with only an attached Shugenja', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-challenger']
                },
                player2: {
                    fate: 5,
                    hand: ['earth-s-examination', 'togashi-kazue'],
                    inPlay: ['doji-whisperer']
                }
            });

            this.challenger = this.player1.findCardByName('doji-challenger');
            this.examination = this.player2.findCardByName('earth-s-examination');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.kazue = this.player2.findCardByName('togashi-kazue');
            this.kazue.traits = [...this.kazue.traits, 'shugenja'];

            this.player1.pass();
            this.player2.clickCard(this.kazue);
            this.player2.clickPrompt('Play Togashi Kazue as an attachment');
            this.player2.clickCard(this.whisperer);
            expect(this.whisperer.attachments).toContain(this.kazue);

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.whisperer],
                type: 'political'
            });
        });

        it('should not be playable', function () {
            this.player2.clickCard(this.examination);
            expect(this.player2).toHavePrompt('Conflict Action Window');
            expect(this.challenger.isTainted).toBe(false);
        });
    });
});
