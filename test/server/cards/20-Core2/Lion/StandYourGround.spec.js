describe('Stand Your Ground', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: [{ card: 'matsu-berserker', honor: 'honored' }, 'ikoma-prodigy', 'doji-whisperer'],
                    hand: ['stand-your-ground', 'no-breath-wasted']
                },
                player2: {
                    inPlay: ['doji-challenger'],
                    hand: ['assassination']
                }
            });
            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.prodigy = this.player1.findCardByName('ikoma-prodigy');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.standYourGround = this.player1.findCardByName('stand-your-ground');
            this.noBreathWasted = this.player1.findCardByName('no-breath-wasted');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.assassination = this.player2.findCardByName('assassination');
        });

        it('keeps an honored character in play and discards its honored status token instead', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.berserker],
                defenders: [this.challenger]
            });
            this.player2.clickCard(this.assassination);
            this.player2.clickCard(this.berserker);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            this.player1.clickCard(this.standYourGround);

            expect(this.berserker.location).toBe('play area');
            expect(this.berserker.isHonored).toBe(false);
            expect(this.berserker.isDishonored).toBe(false);
            expect(this.berserker.isParticipating()).toBe(true);
            expect(this.standYourGround.location).toBe('conflict discard pile');
            expect(this.getChatLogs(5)).toContain('player1 plays Stand Your Ground to prevent Matsu Berserker from leaving play');
        });

        it('does not trigger for a character that is not honored', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.prodigy],
                defenders: [this.challenger]
            });
            this.player2.clickCard(this.assassination);
            this.player2.clickCard(this.prodigy);

            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.prodigy.location).toBe('dynasty discard pile');
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });

        // ruling #108: a prevented pre-dash sacrifice stops the ability from initiating and passes the opportunity to act
        // (the event goes to the discard pile per RRG "Play": "If the cost of an event is (partially) prevented, it is still placed in its owners corresponding discard pile")
        it('stops an event from initiating when it prevents the event\'s sacrifice', function() {
            this.player1.fate = 5;
            // a bowed character so No Breath Wasted has a target
            this.whisperer.bow();
            this.player1.clickCard(this.noBreathWasted);
            this.player1.clickCard(this.whisperer);
            this.player1.clickCard(this.berserker);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            this.player1.clickCard(this.standYourGround);

            expect(this.berserker.location).toBe('play area');
            expect(this.berserker.isHonored).toBe(false);
            expect(this.whisperer.bowed).toBe(true);
            expect(this.noBreathWasted.location).toBe('conflict discard pile');
            expect(this.player1.fate).toBe(4);
            expect(this.getChatLogs(3)).toContain('player1 plays Stand Your Ground to prevent Matsu Berserker from leaving play');
            expect(this.getChatLogs(3)).toContain('player1 attempted to use No Breath Wasted, but did not successfully pay the required costs');
            expect(this.player2).toHavePrompt('Initiate an action');
        });
    });
});
