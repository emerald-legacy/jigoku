describe('triggered ability window', function () {
    integration(function () {
        describe('when one ability could affect several cards', function () {
            beforeEach(function () {
                // Master of Bindings reacts to a character being readied, so the fate
                // phase readying everything gives one ability two candidate cards --
                // the window then nests a second prompt inside the first one's onSelect.
                this.setupTest({
                    phase: 'fate',
                    player1: {
                        inPlay: ['master-of-bindings', 'master-of-bindings']
                    },
                    player2: {
                        inPlay: ['solemn-scholar', 'doji-diplomat']
                    }
                });

                this.bindings1 = this.player1.filterCardsByName('master-of-bindings')[0];
                this.bindings2 = this.player1.filterCardsByName('master-of-bindings')[1];
                this.scholar = this.player2.findCardByName('solemn-scholar');
                this.diplomat = this.player2.findCardByName('doji-diplomat');

                this.scholar.bow();
                this.diplomat.bow();

                this.player1.clickPrompt('Pass');
                this.player2.clickPrompt('Pass');
            });

            it('leaves no card selected once the window has closed', function () {
                expect(this.player1).toHavePrompt('Any reactions?');
                this.player1.clickCard(this.bindings1);
                expect(this.player1).toHavePrompt('Select a card to affect');
                this.player1.clickCard(this.scholar);
                expect(this.scholar.bowed).toBe(true);

                this.player1.clickCard(this.bindings2);
                this.player1.clickCard(this.diplomat);
                expect(this.diplomat.bowed).toBe(true);

                // The nested prompt captured the source card while the outer prompt still
                // had it selected; a leftover selection here is a card the client draws as
                // selected for the rest of the game, and later prompts keep restoring it.
                expect(this.player1).toHavePrompt('Select dynasty cards to discard');
                this.player1.clickPrompt('Done');

                expect(this.player1.player.selectedCards).toEqual([]);
            });
        });
        describe('when the cards its events name have left play', function () {
            beforeEach(function () {
                // Shinjo Sora turns every facedown dynasty card into a hound token, and
                // Composite Yumi reacts to each one. The cards those events name are
                // removed from the game as the tokens are created, so the window has to
                // offer the tokens -- naming the removed cards leaves the player with a
                // prompt they cannot answer.
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-challenger']
                    },
                    player2: {
                        inPlay: ['wandering-ronin', 'shinjo-sora'],
                        dynastyDiscard: ['hida-kisada', 'imperial-storehouse'],
                        hand: ['composite-yumi']
                    }
                });

                this.challenger = this.player1.findCardByName('doji-challenger');
                this.ronin = this.player2.findCardByName('wandering-ronin');
                this.sora = this.player2.findCardByName('shinjo-sora');
                this.yumi = this.player2.findCardByName('composite-yumi');
                this.kisada = this.player2.findCardByName('hida-kisada');
                this.storehouse = this.player2.findCardByName('imperial-storehouse');

                this.player2.moveCard(this.kisada, 'province 1');
                this.player2.moveCard(this.storehouse, 'province 2');
                this.kisada.facedown = true;
                this.storehouse.facedown = true;

                // Leave exactly two facedown cards for Sora to turn into hounds
                this.game
                    .getProvinceArray()
                    .flatMap((location) => this.player2.player.getDynastyCardsInProvince(location))
                    .filter((card) => card.isFacedown() && card !== this.kisada && card !== this.storehouse)
                    .forEach((card) => this.player2.moveCard(card, 'dynasty deck'));

                this.player1.pass();
                this.player2.playAttachment(this.yumi, this.ronin);
                this.noMoreActions();
            });

            it('offers the tokens that entered play, not the cards they replaced', function () {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.challenger],
                    defenders: [this.ronin, this.sora]
                });
                const base = this.ronin.getMilitarySkill();

                this.player2.clickCard(this.sora);
                const hounds = this.game.currentConflict.defenders.filter(
                    (card) => card.name === 'Unleashed Hound'
                );
                expect(hounds.length).toBe(2);

                // The window highlights the cards its events are about. The replaced cards
                // are removed from the game and summarise with no uuid for the client to
                // match, so the highlight has to name the tokens instead.
                const highlighted = this.player2
                    .currentPrompt()
                    .controls.flatMap((control) => control.targets)
                    .map((target) => target.uuid);
                expect(highlighted).toContain(hounds[0].uuid);
                expect(highlighted).toContain(hounds[1].uuid);
                expect(highlighted).not.toContain(this.kisada.uuid);
                expect(highlighted).not.toContain(this.storehouse.uuid);

                expect(this.player2).toHavePrompt('Any reactions to the effects of Shinjo Sora?');
                this.player2.clickCard(this.yumi);

                // One event per token, so the player is asked which one they are answering
                expect(this.player2).toHavePrompt('Select a card to affect');
                expect(this.player2).toBeAbleToSelect(hounds[0]);
                expect(this.player2).toBeAbleToSelect(hounds[1]);
                expect(this.player2).not.toBeAbleToSelect(this.kisada);
                expect(this.player2).not.toBeAbleToSelect(this.storehouse);

                this.player2.clickCard(hounds[0]);
                expect(this.ronin.getMilitarySkill()).toBe(base + 1);

                // The remaining event is still reachable, and resolves without another
                // prompt because it is the only one left
                this.player2.clickCard(this.yumi);
                expect(this.ronin.getMilitarySkill()).toBe(base + 2);
                expect(this.player2).not.toBeAbleToSelect(this.yumi);
            });
        });
    });
});
