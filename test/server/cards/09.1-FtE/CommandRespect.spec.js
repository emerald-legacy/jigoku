describe('Command Respect\'s', function() {
    integration(function() {
        describe('ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['matsu-berserker'],
                        hand: ['command-respect'],
                        honor: 18
                    },
                    player2: {
                        inPlay: ['serene-warrior'],
                        hand: ['banzai', 'fine-katana'],
                        honor: 10
                    }
                });

                this.berserker = this.player1.findCardByName('matsu-berserker');
                this.commandRespect = this.player1.findCardByName('command-respect');

                this.serene = this.player2.findCardByName('serene-warrior');
                this.banzai = this.player2.findCardByName('banzai');
                this.katana = this.player2.findCardByName('fine-katana');

                this.noMoreActions();
            });

            it('should cause the opponent to lose honor when playing events', function() {
                this.opponentHonor = this.player2.honor;
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.berserker],
                    defenders: [this.serene]
                });
                this.player2.pass();
                this.player1.clickCard(this.commandRespect);
                expect(this.getChatLogs(5)).toContain('player1 plays Command Respect to force player2 to give them an honor as an additional cost to play an event until the end of the conflict');
                this.player2.clickCard(this.banzai);
                this.player2.clickCard(this.serene);
                this.player2.clickPrompt('Done');
                expect(this.player2.honor).toBe(this.opponentHonor - 1);
                expect(this.player1.honor).toBe(19);
            });

            it('should not cause the opponent to lose honor for attachments', function() {
                this.opponentHonor = this.player2.honor;
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.berserker],
                    defenders: [this.serene]
                });
                this.player2.pass();
                this.player1.clickCard(this.commandRespect);
                this.player2.clickCard(this.katana);
                this.player2.clickCard(this.serene);
                expect(this.player2.honor).toBe(this.opponentHonor);
            });
        });
    });
});

describe('Command Respect with equal hand sizes', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['matsu-berserker'],
                    hand: ['command-respect', 'fine-katana'],
                    honor: 18
                },
                player2: {
                    inPlay: ['serene-warrior'],
                    hand: ['banzai', 'fine-katana'],
                    honor: 10
                }
            });
            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.commandRespect = this.player1.findCardByName('command-respect');
            this.serene = this.player2.findCardByName('serene-warrior');
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.berserker],
                defenders: [this.serene]
            });
            this.player2.pass();
        });

        // ruling #705: the event counts as in hand, so equal hand sizes block it
        it('should not be playable', function() {
            expect(this.player1.hand.length).toBe(2);
            expect(this.player2.hand.length).toBe(2);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.commandRespect);
            expect(this.commandRespect.location).toBe('hand');
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });
    });
});
