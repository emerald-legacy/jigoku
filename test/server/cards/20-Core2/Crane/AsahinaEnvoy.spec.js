describe('Asahina Envoy', function() {
    integration(function() {
        describe('Asahina Envoy\'s interrupt', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['asahina-envoy', 'border-rider'],
                        dynastyDiscard: [
                            'kakita-yoshi',
                            'kakita-toshimoko',
                            'asahina-storyteller',
                            'doji-challenger',
                            'doji-whisperer',
                            'togashi-initiate'
                        ]
                    },
                    player2: {
                        inPlay: ['miya-mystic'],
                        hand: ['assassination']
                    }
                });

                this.envoy = this.player1.findCardByName('asahina-envoy');
                this.borderRider = this.player1.findCardByName('border-rider');
                this.yoshi = this.player1.findCardByName('kakita-yoshi');
                this.toshimoko = this.player1.findCardByName('kakita-toshimoko');
                this.storyteller = this.player1.findCardByName('asahina-storyteller');
                this.challenger = this.player1.findCardByName('doji-challenger');
                this.whisperer = this.player1.findCardByName('doji-whisperer');
                this.togashiInitiate = this.player1.findCardByName('togashi-initiate');

                this.miyaMystic = this.player2.findCardByName('miya-mystic');
                this.assassination = this.player2.findCardByName('assassination');

                this.player1.reduceDeckToNumber('dynasty deck', 0);
                this.player1.moveCard(this.togashiInitiate, 'dynasty deck');
                this.player1.moveCard(this.whisperer, 'dynasty deck');
                this.player1.moveCard(this.challenger, 'dynasty deck');
                this.player1.moveCard(this.storyteller, 'dynasty deck');
                this.player1.moveCard(this.toshimoko, 'dynasty deck');
                this.player1.moveCard(this.yoshi, 'dynasty deck');

                this.stronghold = this.player1.findCardByName('city-of-the-open-hand');
                this.province1 = this.player1.findCardByName('shameful-display', 'province 1');
                this.province2 = this.player1.findCardByName('shameful-display', 'province 2');

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.borderRider],
                    defenders: []
                });
            });

            it('should trigger when the envoy leaves play and let the player pick a non-stronghold province', function() {
                this.player2.clickCard(this.assassination);
                this.player2.clickCard(this.envoy);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.envoy);
                this.player1.clickCard(this.envoy);
                expect(this.player1).toBeAbleToSelect(this.province1);
                expect(this.player1).toBeAbleToSelect(this.province2);
                expect(this.player1).not.toBeAbleToSelect(this.stronghold);
            });

            it('should put a Crane character with cost 4+ into the chosen province faceup', function() {
                this.player2.clickCard(this.assassination);
                this.player2.clickCard(this.envoy);
                this.player1.clickCard(this.envoy);
                this.player1.clickCard(this.province1);
                expect(this.player1).toHavePromptButton('Kakita Yoshi');
                expect(this.player1).toHavePromptButton('Kakita Toshimoko');
                expect(this.player1).toHavePromptButton('Asahina Storyteller');
                expect(this.player1).not.toHavePromptButton('Doji Challenger');
                expect(this.player1).not.toHavePromptButton('Doji Whisperer');
                expect(this.player1).not.toHavePromptButton('Togashi Initiate');

                this.player1.clickPrompt('Kakita Yoshi');
                expect(this.yoshi.location).toBe('province 1');
                expect(this.yoshi.facedown).toBe(false);
            });

            it('should allow the player to select no character', function() {
                this.player2.clickCard(this.assassination);
                this.player2.clickCard(this.envoy);
                this.player1.clickCard(this.envoy);
                this.player1.clickCard(this.province2);
                expect(this.player1).toHavePromptButton('Take nothing');
                this.player1.clickPrompt('Take nothing');
                expect(this.yoshi.location).toBe('dynasty deck');
                expect(this.toshimoko.location).toBe('dynasty deck');
                expect(this.storyteller.location).toBe('dynasty deck');
                expect(this.getChatLogs(5)).toContain('player1 selects no characters');
            });
        });
    });
});
