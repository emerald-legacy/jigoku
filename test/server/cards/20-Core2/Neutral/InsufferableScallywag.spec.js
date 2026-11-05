describe('Insufferable Scallywag', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['insufferable-scallywag', 'brash-samurai']
                },
                player2: {
                    inPlay: ['kakita-asami', 'kitsu-warrior', 'kakita-yoshi']
                }
            });

            this.scallywag = this.player1.findCardByName('insufferable-scallywag');
            this.brashSamurai = this.player1.findCardByName('brash-samurai');
            this.asami = this.player2.findCardByName('kakita-asami');
            this.kitsuWarrior = this.player2.findCardByName('kitsu-warrior');
            this.yoshi = this.player2.findCardByName('kakita-yoshi');

            this.scallywag.fate = 1;
        });

        it('should let the opponent choose to dishonor the chosen character', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.scallywag, this.brashSamurai],
                defenders: [this.asami, this.kitsuWarrior]
            });
            this.player2.pass();
            this.player1.clickCard(this.scallywag);
            expect(this.player1).toBeAbleToSelect(this.asami);
            expect(this.player1).not.toBeAbleToSelect(this.kitsuWarrior);
            expect(this.player1).not.toBeAbleToSelect(this.yoshi);
            expect(this.player1).not.toBeAbleToSelect(this.brashSamurai);
            this.player1.clickCard(this.asami);
            expect(this.scallywag.fate).toBe(0);
            expect(this.player2).toHavePromptButton('Dishonor this character');
            expect(this.player2).toHavePromptButton('Move this character home');
            this.player2.clickPrompt('Dishonor this character');
            expect(this.asami.isDishonored).toBe(true);
            expect(this.asami.isDefending()).toBe(true);
        });

        it('should let the opponent choose to move the chosen character home', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.scallywag, this.brashSamurai],
                defenders: [this.asami, this.kitsuWarrior]
            });
            this.player2.pass();
            this.player1.clickCard(this.scallywag);
            this.player1.clickCard(this.asami);
            this.player2.clickPrompt('Move this character home');
            expect(this.asami.isParticipating()).toBe(false);
            expect(this.asami.isDishonored).toBe(false);
            expect(this.scallywag.fate).toBe(0);
        });

        it('should not be usable without fate on it', function() {
            this.scallywag.fate = 0;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.scallywag, this.brashSamurai],
                defenders: [this.asami, this.kitsuWarrior]
            });
            this.player2.pass();
            this.player1.clickCard(this.scallywag);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.asami.isDishonored).toBe(false);
        });

        it('should not be usable while it is not participating', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.brashSamurai],
                defenders: [this.asami, this.kitsuWarrior]
            });
            this.player2.pass();
            this.player1.clickCard(this.scallywag);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.scallywag.fate).toBe(1);
        });
    });
});

describe('Insufferable Scallywag with characters on the other side than their controller', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['insufferable-scallywag', 'endless-plains-skirmisher']
                },
                player2: {
                    inPlay: ['doji-challenger', 'endless-plains-skirmisher']
                }
            });
            this.scallywag = this.player1.findCardByName('insufferable-scallywag');
            this.skirmisher1 = this.player1.findCardByName('endless-plains-skirmisher');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.skirmisher2 = this.player2.findCardByName('endless-plains-skirmisher');
            this.scallywag.fate = 1;

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.scallywag],
                defenders: [this.challenger]
            });
            this.player2.clickCard(this.skirmisher2);
            this.player2.clickPrompt('player1');
            this.player1.clickCard(this.skirmisher1);
            this.player1.clickPrompt('player2');
            this.player2.pass();
        });

        it('chooses a character on the enemy side, whoever controls it, and its controller selects', function() {
            expect(this.game.currentConflict.attackers).toContain(this.skirmisher2);
            expect(this.game.currentConflict.defenders).toContain(this.skirmisher1);

            this.player1.clickCard(this.scallywag);
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).toBeAbleToSelect(this.skirmisher1);
            expect(this.player1).not.toBeAbleToSelect(this.skirmisher2);

            this.player1.clickCard(this.skirmisher1);
            expect(this.player1).toHavePromptButton('Dishonor this character');
            expect(this.player1).toHavePromptButton('Move this character home');
            this.player1.clickPrompt('Move this character home');
            expect(this.skirmisher1.isParticipating()).toBe(false);
        });
    });
});
