describe('Doji Shigenobu', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-shigenobu', 'doji-whisperer', 'brash-samurai']
                },
                player2: {
                    inPlay: ['bayushi-dairu']
                }
            });
            this.shigenobu = this.player1.findCardByName('doji-shigenobu');
            this.brash = this.player1.findCardByName('brash-samurai');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.dairu = this.player2.findCardByName('bayushi-dairu');

            this.brash.honor();
        });

        it('should bow an enemy at the cost of bowing your participating then ask if you want to move home', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.whisperer, this.shigenobu],
                defenders: [this.dairu]
            });

            this.player2.pass();

            this.player1.clickCard(this.shigenobu);
            expect(this.player1).not.toBeAbleToSelect(this.whisperer);
            expect(this.player1).not.toBeAbleToSelect(this.shigenobu);
            expect(this.player1).toBeAbleToSelect(this.dairu);
            this.player1.clickCard(this.dairu);

            expect(this.dairu.bowed).toBe(false);

            expect(this.player1).toHavePrompt('Select card to bow');
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            expect(this.player1).toBeAbleToSelect(this.shigenobu);

            this.player1.clickCard(this.whisperer);
            expect(this.getChatLogs(5)).toContain(
                'player1 uses Dōji Shigenobu, bowing Doji Whisperer to bow Bayushi Dairu'
            );

            expect(this.player1).toHavePrompt('Do you want to move home?');
            expect(this.player1).toHavePromptButton('Yes');
            expect(this.player1).toHavePromptButton('No');

            expect(this.shigenobu.isParticipating()).toBe(true);
            this.player1.clickPrompt('Yes');
            expect(this.shigenobu.isParticipating()).toBe(false);
            expect(this.getChatLogs('5')).toContain('player1 chooses to move Dōji Shigenobu home');
        });

        it('choosing not to move home', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.whisperer, this.shigenobu],
                defenders: [this.dairu]
            });

            this.player2.pass();

            this.player1.clickCard(this.shigenobu);
            this.player1.clickCard(this.dairu);
            this.player1.clickCard(this.whisperer);

            expect(this.player1).toHavePrompt('Do you want to move home?');
            expect(this.player1).toHavePromptButton('Yes');
            expect(this.player1).toHavePromptButton('No');

            expect(this.shigenobu.isParticipating()).toBe(true);
            this.player1.clickPrompt('No');
            expect(this.shigenobu.isParticipating()).toBe(true);
            expect(this.getChatLogs('5')).not.toContain('player1 chooses to move Dōji Shigenobu home');
        });
    });
});

describe('Doji Shigenobu with characters on the other side than their controller', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-shigenobu', 'doji-whisperer', 'endless-plains-skirmisher']
                },
                player2: {
                    inPlay: ['solemn-scholar', 'endless-plains-skirmisher']
                }
            });
            this.shigenobu = this.player1.findCardByName('doji-shigenobu');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.skirmisher1 = this.player1.findCardByName('endless-plains-skirmisher');
            this.scholar = this.player2.findCardByName('solemn-scholar');
            this.skirmisher2 = this.player2.findCardByName('endless-plains-skirmisher');

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.shigenobu, this.whisperer],
                defenders: [this.scholar]
            });
            this.player2.clickCard(this.skirmisher2);
            this.player2.clickPrompt('player1');
            this.player1.clickCard(this.skirmisher1);
            this.player1.clickPrompt('player2');
        });

        it('bows a character on your side and chooses a character on the enemy side, by side', function () {
            this.player2.pass();
            expect(this.game.currentConflict.attackers).toContain(this.skirmisher2);
            expect(this.game.currentConflict.defenders).toContain(this.skirmisher1);

            this.player1.clickCard(this.shigenobu);
            expect(this.player1).toBeAbleToSelect(this.scholar);
            expect(this.player1).toBeAbleToSelect(this.skirmisher1);
            expect(this.player1).not.toBeAbleToSelect(this.skirmisher2);
            this.player1.clickCard(this.skirmisher1);

            expect(this.player1).toHavePrompt('Select card to bow');
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            expect(this.player1).not.toBeAbleToSelect(this.skirmisher1);
            this.player1.clickCard(this.whisperer);
            expect(this.skirmisher1.bowed).toBe(true);
            expect(this.getChatLogs(5)).toContain('player1 uses Dōji Shigenobu, bowing Doji Whisperer to bow Endless Plains Skirmisher');
        });
    });
});

describe('Doji Shigenobu when the bow is cancelled', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-shigenobu', 'doji-whisperer']
                },
                player2: {
                    inPlay: ['bayushi-dairu'],
                    hand: ['finger-of-jade']
                }
            });
            this.shigenobu = this.player1.findCardByName('doji-shigenobu');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.dairu = this.player2.findCardByName('bayushi-dairu');

            this.player1.pass();
            this.fingerOfJade = this.player2.playAttachment('finger-of-jade', this.dairu);
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.whisperer, this.shigenobu],
                defenders: [this.dairu]
            });
            this.player2.pass();
        });

        it('does not offer to move home', function () {
            this.player1.clickCard(this.shigenobu);
            this.player1.clickCard(this.dairu);
            this.player1.clickCard(this.whisperer);
            expect(this.whisperer.bowed).toBe(true);
            expect(this.player2).toHavePrompt('Triggered Abilities');
            this.player2.clickCard(this.fingerOfJade);
            expect(this.dairu.bowed).toBe(false);
            expect(this.player1).not.toHavePrompt('Do you want to move home?');
            expect(this.player2).toHavePrompt('Conflict Action Window');
            expect(this.shigenobu.isParticipating()).toBe(true);
        });
    });
});
