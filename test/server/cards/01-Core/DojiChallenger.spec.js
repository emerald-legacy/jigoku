describe('Doji Challenger', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-challenger', 'brash-samurai']
                },
                player2: {
                    inPlay: ['doji-whisperer', 'moto-horde', 'kakita-asami']
                }
            });
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.brash = this.player1.findCardByName('brash-samurai');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.horde = this.player2.findCardByName('moto-horde');
            this.asami = this.player2.findCardByName('kakita-asami');
            this.noMoreActions();
        });

        it('moves a character controlled by your opponent to the conflict while attacking', function() {
            this.initiateConflict({
                type: 'political',
                attackers: [this.challenger],
                defenders: [this.asami]
            });
            this.player2.pass();
            this.player1.clickCard(this.challenger);
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            expect(this.player1).not.toBeAbleToSelect(this.brash);
            this.player1.clickCard(this.whisperer);
            expect(this.whisperer.isParticipating()).toBe(true);
            expect(this.game.currentConflict.defenders).toContain(this.whisperer);
        });

        it('cannot move a character with a dash in the conflict\'s skill (ruling #36)', function() {
            this.initiateConflict({
                type: 'political',
                attackers: [this.challenger],
                defenders: [this.asami]
            });
            this.player2.pass();
            this.player1.clickCard(this.challenger);
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            expect(this.player1).not.toBeAbleToSelect(this.horde);
        });

        it('cannot be used while it is at home', function() {
            this.initiateConflict({
                type: 'political',
                attackers: [this.brash],
                defenders: [this.asami]
            });
            this.player2.pass();
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.challenger);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.whisperer.isParticipating()).toBe(false);
        });

        it('cannot be used while it is defending', function() {
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.asami],
                defenders: [this.challenger]
            });
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.challenger);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.whisperer.isParticipating()).toBe(false);
        });
    });
});
