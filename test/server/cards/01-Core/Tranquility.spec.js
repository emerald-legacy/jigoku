describe('Tranquility', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-challenger', 'doji-whisperer', 'adept-of-the-waves'],
                    hand: ['tranquility']
                },
                player2: {
                    fate: 5,
                    honor: 10,
                    inPlay: ['brash-samurai', 'adept-of-the-waves'],
                    hand: ['adept-of-shadows']
                }
            });
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.ownAdept = this.player1.findCardByName('adept-of-the-waves', 'play area');
            this.tranquility = this.player1.findCardByName('tranquility');
            this.brash = this.player2.findCardByName('brash-samurai');
            this.homeAdept = this.player2.findCardByName('adept-of-the-waves', 'play area');
            this.shadows = this.player2.findCardByName('adept-of-shadows');
        });

        it('stops the opponent\'s characters at home from triggering abilities', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.brash]
            });
            this.player2.pass();
            this.player1.clickCard(this.tranquility);
            expect(this.tranquility.location).toBe('conflict discard pile');
            expect(this.getChatLogs(3)).toContain('player1 plays Tranquility to stop characters at player2\'s home from triggering abilities until the end of the conflict');
            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player2.clickCard(this.homeAdept);
            expect(this.player2).toHavePrompt('Conflict Action Window');
            expect(this.player2).not.toHavePrompt('Adept of the Waves');
        });

        it('does not stop the opponent\'s participating characters', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.brash]
            });
            this.player2.pass();
            this.player1.clickCard(this.tranquility);
            this.player2.clickCard(this.brash);
            expect(this.brash.isHonored).toBe(true);
        });

        it('does not stop your own characters at home', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.brash]
            });
            this.player2.pass();
            this.player1.clickCard(this.tranquility);
            this.player2.pass();
            this.player1.clickCard(this.ownAdept);
            expect(this.player1).toHavePrompt('Adept of the Waves');
            expect(this.player1).toBeAbleToSelect(this.challenger);
        });

        it('does not stop a character that enters the opponent\'s home after it resolved (ruling #164)', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.brash]
            });
            this.player2.pass();
            this.player1.clickCard(this.tranquility);
            this.player2.playCharacterFromHand(this.shadows);
            this.player2.clickPrompt('Home');
            expect(this.shadows.location).toBe('play area');
            expect(this.shadows.isParticipating()).toBe(false);
            expect(this.player2.honor).toBe(10);
            this.player1.pass();
            this.player2.clickCard(this.shadows);
            expect(this.shadows.location).toBe('hand');
            expect(this.player2.honor).toBe(9);
        });

        it('still stops a character moved from the opponent\'s home into the conflict (ruling #164)', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.brash]
            });
            this.player2.pass();
            this.player1.clickCard(this.tranquility);
            this.player2.pass();
            this.player1.clickCard(this.challenger);
            this.player1.clickCard(this.homeAdept);
            expect(this.homeAdept.isParticipating()).toBe(true);
            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player2.clickCard(this.homeAdept);
            expect(this.player2).toHavePrompt('Conflict Action Window');
            expect(this.player2).not.toHavePrompt('Adept of the Waves');
        });

        it('stops blocking abilities when the conflict ends', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.whisperer],
                defenders: [this.brash]
            });
            this.player2.pass();
            this.player1.clickCard(this.tranquility);
            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player2 won a military conflict 2 vs 0');
            expect(this.player1).toHavePrompt('Action Window');
            this.player1.pass();
            this.player2.clickCard(this.homeAdept);
            expect(this.player2).toHavePrompt('Adept of the Waves');
            expect(this.player2).toBeAbleToSelect(this.brash);
        });

        it('cannot be played outside a conflict', function() {
            expect(this.player1).toHavePrompt('Action Window');
            this.player1.clickCard(this.tranquility);
            expect(this.tranquility.location).toBe('hand');
            expect(this.player1).toHavePrompt('Action Window');
        });
    });
});
