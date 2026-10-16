describe('Kitsu Spiritcaller 2', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['kitsu-spiritcaller-2', 'brash-samurai'],
                    dynastyDiscard: ['matsu-berserker', 'doji-whisperer'],
                    conflictDiscard: ['master-of-the-spear']
                },
                player2: {
                    inPlay: ['kakita-asami'],
                    dynastyDiscard: ['akodo-gunso']
                }
            });

            this.spiritcaller = this.player1.findCardByName('kitsu-spiritcaller-2');
            this.brashSamurai = this.player1.findCardByName('brash-samurai');
            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.masterOfTheSpear = this.player1.findCardByName('master-of-the-spear');
            this.asami = this.player2.findCardByName('kakita-asami');
            this.gunso = this.player2.findCardByName('akodo-gunso');
        });

        it('should not be usable outside a conflict', function() {
            this.player1.clickCard(this.spiritcaller);
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.spiritcaller.bowed).toBe(false);
        });

        it('should bow itself, even from home, and put a Lion character from your discard piles into the conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.brashSamurai],
                defenders: [this.asami]
            });
            this.player2.pass();
            this.player1.clickCard(this.spiritcaller);
            expect(this.player1).toHavePrompt('Choose a character from a discard pile');
            expect(this.player1).toBeAbleToSelect(this.berserker);
            expect(this.player1).toBeAbleToSelect(this.masterOfTheSpear);
            expect(this.player1).not.toBeAbleToSelect(this.whisperer);
            expect(this.player1).not.toBeAbleToSelect(this.gunso);
            this.player1.clickCard(this.berserker);
            expect(this.spiritcaller.bowed).toBe(true);
            expect(this.berserker.location).toBe('play area');
            expect(this.berserker.isAttacking()).toBe(true);
            expect(this.getChatLogs(3)).toContain('player1 uses Kitsu Spiritcaller, bowing Kitsu Spiritcaller to call Matsu Berserker back from the dead until the end of the conflict');
        });

        it('should return the character to the bottom of its deck at the end of the conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.brashSamurai],
                defenders: [this.asami]
            });
            this.player2.pass();
            this.player1.clickCard(this.spiritcaller);
            this.player1.clickCard(this.masterOfTheSpear);
            expect(this.masterOfTheSpear.isAttacking()).toBe(true);
            this.noMoreActions();
            this.player1.clickPrompt('No');
            this.player1.clickPrompt('Gain 2 honor');
            expect(this.masterOfTheSpear.location).toBe('conflict deck');
            expect(this.player1.player.conflictDeck.at(-1)).toBe(this.masterOfTheSpear);
            expect(this.getChatLogs(5)).toContain('Master of the Spear returns to the bottom of the deck due to Kitsu Spiritcaller\'s effect');
        });

        it('should not be usable while bowed', function() {
            this.spiritcaller.bowed = true;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.brashSamurai],
                defenders: [this.asami]
            });
            this.player2.pass();
            this.player1.clickCard(this.spiritcaller);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.berserker.location).toBe('dynasty discard pile');
        });
    });
});
