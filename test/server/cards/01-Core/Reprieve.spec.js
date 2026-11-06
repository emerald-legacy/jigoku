describe('Reprieve', function() {
    integration(function() {
        describe('when the attached character would be discarded', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: [
                            { card: 'valiant-oathkeeper', attachments: ['reprieve'] },
                            'samurai-of-integrity'
                        ]
                    },
                    player2: {
                        honor: 10,
                        hand: ['assassination']
                    }
                });
                this.oathkeeper = this.player1.findCardByName('valiant-oathkeeper');
                this.samurai = this.player1.findCardByName('samurai-of-integrity');
                this.reprieve = this.player1.findCardByName('reprieve');
                this.assassination = this.player2.findCardByName('assassination');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.oathkeeper, this.samurai],
                    defenders: []
                });
                this.player2.clickCard(this.assassination);
                this.player2.clickCard(this.oathkeeper);
            });

            it('discards itself instead', function() {
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.reprieve);
                this.player1.clickCard(this.reprieve);
                expect(this.getChatLogs(5)).toContain('player1 uses Reprieve to prevent Valiant Oathkeeper from leaving play');
                expect(this.oathkeeper.location).toBe('play area');
                expect(this.oathkeeper.isAttacking()).toBe(true);
                expect(this.reprieve.location).toBe('conflict discard pile');
                expect(this.assassination.location).toBe('conflict discard pile');
                expect(this.player2.honor).toBe(7);
            });

            it('lets the character leave play if its controller does not use it', function() {
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.pass();
                expect(this.oathkeeper.location).toBe('dynasty discard pile');
                expect(this.reprieve.location).toBe('conflict discard pile');
            });
        });

        describe('when the attached character would be sacrificed to pay a character ability\'s cost', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: [
                            { card: 'vanguard-warrior', attachments: ['reprieve'] },
                            'valiant-oathkeeper'
                        ]
                    }
                });
                this.vanguard = this.player1.findCardByName('vanguard-warrior');
                this.oathkeeper = this.player1.findCardByName('valiant-oathkeeper');
                this.reprieve = this.player1.findCardByName('reprieve');
            });

            it('prevents the sacrifice, so the cost is not paid and the ability does not resolve (ruling #726)', function() {
                this.player1.clickCard(this.vanguard);
                this.player1.clickCard(this.oathkeeper);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.reprieve);
                this.player1.clickCard(this.reprieve);
                expect(this.vanguard.location).toBe('play area');
                expect(this.reprieve.location).toBe('conflict discard pile');
                expect(this.oathkeeper.fate).toBe(0);
                expect(this.getChatLogs(5)).toContain('player1 attempted to use Vanguard Warrior, but did not successfully pay the required costs');
            });
        });

        describe('when the attached character would be sacrificed to pay an event\'s cost', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 5,
                        inPlay: [{ card: 'doji-challenger', honor: 'honored', attachments: ['reprieve'] }],
                        hand: ['noble-sacrifice']
                    },
                    player2: {
                        inPlay: [{ card: 'bayushi-liar', honor: 'dishonored' }]
                    }
                });
                this.challenger = this.player1.findCardByName('doji-challenger');
                this.reprieve = this.player1.findCardByName('reprieve');
                this.nobleSacrifice = this.player1.findCardByName('noble-sacrifice');
                this.liar = this.player2.findCardByName('bayushi-liar');
            });

            it('prevents the sacrifice, so the event\'s effects do not resolve (ruling #726)', function() {
                this.player1.clickCard(this.nobleSacrifice);
                this.player1.clickCard(this.liar);
                this.player1.clickCard(this.challenger);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.reprieve);
                this.player1.clickCard(this.reprieve);
                expect(this.challenger.location).toBe('play area');
                expect(this.reprieve.location).toBe('conflict discard pile');
                expect(this.liar.location).toBe('play area');
                expect(this.getChatLogs(5)).toContain('player1 attempted to use Noble Sacrifice, but did not successfully pay the required costs');
                // decisions.md: a stopped event goes to the discard pile (RRG "Play" over the ruling's "remains in hand")
                expect(this.nobleSacrifice.location).toBe('conflict discard pile');
            });
        });
    });
});
