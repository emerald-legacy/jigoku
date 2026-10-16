describe('Prompt answers', function() {
    integration(function() {
        // what a modified client could send: an arg no button of the current prompt offers
        const send = function(wrapper, game, arg, method) {
            const prompt = wrapper.player.currentPrompt();
            const uuid = [...prompt.buttons, ...prompt.controls][0].uuid;
            game.menuButton(wrapper.player.name, arg, uuid, method);
            game.continue();
        };

        describe('honor bids', function() {
            beforeEach(function() {
                this.setupTest({ phase: 'dynasty' });
                this.flow.nextPhase();
            });

            it('rejects a bid that was not offered', function() {
                send(this.player1, this.game, -1);
                send(this.player1, this.game, 20);
                expect(this.player1).toHavePrompt('Honor Bid');
                this.player1.clickPrompt('3');
                expect(this.player1).not.toHavePrompt('Honor Bid');
            });
        });

        describe('menus and target prompts', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['exiled-guardian', 'young-rumormonger'],
                        hand: ['test-of-skill']
                    }
                });
                this.guardian = this.player1.findCardByName('exiled-guardian');
                this.rumormonger = this.player1.findCardByName('young-rumormonger');
                this.testOfSkill = this.player1.findCardByName('test-of-skill');
                this.rumormonger.dishonor();
            });

            it('rejects a menu index out of range', function() {
                this.player1.clickCard(this.testOfSkill);
                expect(this.player1).toHavePrompt('Select a card type');
                send(this.player1, this.game, 99);
                expect(this.player1).toHavePrompt('Select a card type');
            });

            it('rejects cancelling a prompt that offers no cancel', function() {
                this.player1.clickCard(this.guardian);
                this.player1.clickPrompt('Pay costs first');
                expect(this.player1).not.toHavePromptButton('Cancel');
                send(this.player1, this.game, 'cancel');
                this.player1.clickCard(this.rumormonger);
                expect(this.rumormonger.isDishonored).toBe(false);
            });
        });
    });
});
