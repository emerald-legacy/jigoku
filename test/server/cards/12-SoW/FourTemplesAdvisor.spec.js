describe('Four Temples Advisor', function() {
    integration(function() {
        describe('Four Temples Advisor\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['brash-samurai', 'doji-whisperer'],
                        hand: ['four-temples-advisor']
                    },
                    player2: {
                        inPlay: ['bayushi-shoju']
                    }
                });

                this.brash = this.player1.findCardByName('brash-samurai');
                this.bayushiShoju = this.player2.findCardByName('bayushi-shoju');
                this.advisor = this.player1.findCardByName('four-temples-advisor');
                this.whisperer = this.player1.findCardByName('doji-whisperer');
                this.player1.playAttachment(this.advisor, this.brash);

                this.game.rings.air.fate = 1;
                this.game.rings.void.fate = 1;
            });

            it('should trigger when you gain fate during a conflict in which attached character is participating', function() {
                const handSize = this.player1.hand.length;

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.brash],
                    ring: 'air'
                });
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.advisor);

                this.player1.clickCard(this.advisor);
                expect(this.player1.hand.length).toBe(handSize + 1);
            });

            it('should trigger when you gain fate during a conflict in which attached character is not participating', function() {
                const handSize = this.player1.hand.length;

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.whisperer],
                    ring: 'air'
                });
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.advisor);

                this.player1.clickCard(this.advisor);
                expect(this.player1.hand.length).toBe(handSize + 1);
            });

            it('should be able to trigger more than once', function() {
                const handSize = this.player1.hand.length;

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.whisperer],
                    ring: 'air'
                });
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.advisor);

                this.player1.clickCard(this.advisor);
                expect(this.player1.hand.length).toBe(handSize + 1);

                this.player2.clickPrompt('Done');

                this.noMoreActions();
                this.noMoreActions();
                this.player2.passConflict();
                this.noMoreActions();

                this.initiateConflict({
                    type: 'political',
                    attackers: [this.brash],
                    ring: 'void'
                });
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.advisor);

                this.player1.clickCard(this.advisor);
                expect(this.player1.hand.length).toBe(handSize + 2);
            });

            it('should not trigger when an opponent gains fate during a conflict in which Trusted Advisor is participating', function() {
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.bayushiShoju],
                    defenders: [this.brash],
                    ring: 'air'
                });
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).not.toBeAbleToSelect(this.advisor);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });
        });

        describe('Four Temples Advisor with Know the World', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['brash-samurai'],
                        hand: ['four-temples-advisor', 'know-the-world']
                    },
                    player2: {
                        inPlay: ['bayushi-shoju']
                    }
                });

                this.brash = this.player1.findCardByName('brash-samurai');
                this.advisor = this.player1.findCardByName('four-temples-advisor');
                this.player1.playAttachment(this.advisor, this.brash);
                this.player2.pass();
                this.player1.claimRing('earth');
                this.game.rings.air.fate = 2;
                this.fate = this.player1.fate;
            });

            it('should trigger when the ring that is taken has fate', function() {
                this.player1.clickCard('know-the-world');
                this.player1.clickRing('earth');
                this.player1.clickRing('air');
                expect(this.player1.fate).toBe(this.fate - 1 + 2);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.advisor);
            });

            it('should not trigger when the ring that is taken has no fate', function() {
                this.game.rings.air.fate = 0;
                this.player1.clickCard('know-the-world');
                this.player1.clickRing('earth');
                this.player1.clickRing('air');
                expect(this.player1.fate).toBe(this.fate - 1);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.getChatLogs(10)).not.toContain('player1 takes 0 fate from Air Ring');
            });
        });
    });
});

