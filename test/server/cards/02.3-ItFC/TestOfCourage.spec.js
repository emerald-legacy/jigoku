describe('Test of Courage', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['matsu-berserker', 'akodo-toturi', 'doji-challenger'],
                    hand: ['test-of-courage']
                },
                player2: {
                    inPlay: ['doji-whisperer']
                }
            });
            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.toturi = this.player1.findCardByName('akodo-toturi');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.testOfCourage = this.player1.findCardByName('test-of-courage');
            this.player1.player.showBid = 1;
            this.player2.player.showBid = 3;
        });

        it('cannot be played outside a conflict', function() {
            this.player1.clickCard(this.testOfCourage);
            expect(this.testOfCourage.location).toBe('hand');
            expect(this.player1).toHavePrompt('Action Window');
        });

        it('moves a character to the conflict, then honors it', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.berserker],
                defenders: [this.whisperer]
            });
            this.player2.pass();
            this.player1.clickCard(this.testOfCourage);
            this.player1.clickCard(this.toturi);
            expect(this.toturi.isParticipating()).toBe(true);
            expect(this.toturi.isHonored).toBe(true);
        });

        it('can only choose a Lion character you control', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.berserker],
                defenders: [this.whisperer]
            });
            this.player2.pass();
            this.player1.clickCard(this.testOfCourage);
            expect(this.player1).toHavePrompt('Test of Courage');
            expect(this.player1).toBeAbleToSelect(this.toturi);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
            expect(this.player1).not.toBeAbleToSelect(this.whisperer);
        });

        it('can choose a Lion character already in the conflict and honors it (ruling #819)', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.berserker],
                defenders: [this.whisperer]
            });
            this.player2.pass();
            this.player1.clickCard(this.testOfCourage);
            expect(this.player1).toBeAbleToSelect(this.berserker);
            this.player1.clickCard(this.berserker);
            expect(this.berserker.isParticipating()).toBe(true);
            expect(this.berserker.isHonored).toBe(true);
            expect(this.testOfCourage.location).toBe('conflict discard pile');
            expect(this.player2).toHavePrompt('Conflict Action Window');
        });

        it('cannot be played when your honor bid equals your opponent\'s', function() {
            this.player1.player.showBid = 3;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.berserker],
                defenders: [this.whisperer]
            });
            this.player2.pass();
            this.player1.clickCard(this.testOfCourage);
            expect(this.testOfCourage.location).toBe('hand');
            expect(this.toturi.isParticipating()).toBe(false);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });

        it('cannot be played when your honor bid is higher than your opponent\'s', function() {
            this.player1.player.showBid = 5;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.berserker],
                defenders: [this.whisperer]
            });
            this.player2.pass();
            this.player1.clickCard(this.testOfCourage);
            expect(this.testOfCourage.location).toBe('hand');
            expect(this.toturi.isParticipating()).toBe(false);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });
    });
});
