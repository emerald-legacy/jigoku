describe('Warrior of the Open Hand', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 5,
                    inPlay: ['warrior-of-the-open-hand', 'brash-samurai']
                },
                player2: {
                    inPlay: ['kakita-asami', 'doji-challenger']
                }
            });

            this.warrior = this.player1.findCardByName('warrior-of-the-open-hand');
            this.brashSamurai = this.player1.findCardByName('brash-samurai');
            this.asami = this.player2.findCardByName('kakita-asami');
            this.challenger = this.player2.findCardByName('doji-challenger');
        });

        it('should return itself to hand while attacking against defending characters', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.warrior, this.brashSamurai]
            });
            this.player1.clickCard(this.challenger);
            this.player2.assignDefenders([this.asami]);
            this.player2.pass();
            this.player1.clickCard(this.warrior);
            expect(this.warrior.location).toBe('hand');
            expect(this.getChatLogs(5)).toContain('player1 uses Warrior of the Open Hand to return Warrior of the Open Hand to their hand');
        });

        it('should not be usable when there are no defending characters', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.warrior]
            });
            this.player1.clickPrompt('No Target');
            this.player2.assignDefenders([]);
            this.player2.pass();
            this.player1.clickCard(this.warrior);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.warrior.location).toBe('play area');
            expect(this.warrior.isAttacking()).toBe(true);
        });

        it('should not be usable while defending', function() {
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.warrior]
            });
            this.player1.clickCard(this.warrior);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.warrior.location).toBe('play area');
            expect(this.warrior.isDefending()).toBe(true);
        });

        it('should only be usable once per round', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.warrior, this.brashSamurai]
            });
            this.player1.clickCard(this.challenger);
            this.player2.assignDefenders([this.asami]);
            this.player2.pass();
            this.player1.clickCard(this.warrior);
            expect(this.warrior.location).toBe('hand');
            this.player2.pass();
            this.player1.playCharacterFromHand(this.warrior);
            this.player1.clickPrompt('Conflict');
            expect(this.warrior.isAttacking()).toBe(true);
            this.player2.pass();
            this.player1.clickCard(this.warrior);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.warrior.location).toBe('play area');
        });
    });
});
