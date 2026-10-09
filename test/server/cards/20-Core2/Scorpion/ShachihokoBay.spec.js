describe('Shachihoko Bay', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['matsu-berserker'],
                    hand: ['assassination', 'finger-of-jade', 'tattooed-wanderer', 'kami-unleashed', 'censure', 'levy', 'banzai']
                },
                player2: {
                    provinces: ['shachihoko-bay']
                }
            });

            /* The cards will start in this order on top of deck */
            this.levy = this.player1.findCardByName('levy', 'hand');
            this.censure = this.player1.findCardByName('censure', 'hand');
            this.kamiUnleashed = this.player1.findCardByName('kami-unleashed', 'hand');
            this.tattooedWanderer = this.player1.findCardByName('tattooed-wanderer', 'hand');
            this.fingerOfJade = this.player1.findCardByName('finger-of-jade', 'hand');
            this.assassination = this.player1.findCardByName('assassination', 'hand');
            // Banzai! is the 7th card, below the 6 Shachihoko Bay looks at
            this.banzai = this.player1.findCardByName('banzai', 'hand');
            this.player1.player.moveCard(this.banzai, 'conflict deck');
            this.player1.player.moveCard(this.assassination, 'conflict deck');
            this.player1.player.moveCard(this.fingerOfJade, 'conflict deck');
            this.player1.player.moveCard(this.tattooedWanderer, 'conflict deck');
            this.player1.player.moveCard(this.kamiUnleashed, 'conflict deck');
            this.player1.player.moveCard(this.censure, 'conflict deck');
            this.player1.player.moveCard(this.levy, 'conflict deck');

            this.shachihokoBay = this.player2.findCardByName('shachihoko-bay');

            this.noMoreActions();
            this.initiateConflict({
                attackers: ['matsu-berserker'],
                defenders: [],
                jumpTo: 'afterConflict'
            });
        });

        it('should trigger when it is broken', function () {
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.shachihokoBay);
        });

        it('steals cards and reorder opponent deck', function () {
            this.player2.clickCard(this.shachihokoBay);
            expect(this.getChatLogs(1)).toContain('player2 uses Shachihoko Bay to look at the top 6 cards of player1\'s deck');
            expect(this.player2).toHavePrompt('Select up to 3 cards to take');
            expect(this.player2).toHavePromptButton(this.assassination.name);
            expect(this.player2).toHavePromptButton(this.fingerOfJade.name);
            expect(this.player2).toHavePromptButton(this.tattooedWanderer.name);
            expect(this.player2).toHavePromptButton(this.kamiUnleashed.name);
            expect(this.player2).toHavePromptButton(this.censure.name);
            expect(this.player2).toHavePromptButton(this.levy.name);
            expect(this.player2).not.toHavePromptButton(this.banzai.name);
            expect(this.player2).toHavePromptButton('Take nothing');

            this.player2.clickPrompt(this.assassination.name);
            expect(this.player2).toHavePrompt('Select up to 3 cards to take');
            expect(this.player2).not.toHavePromptButton(this.assassination.name);
            expect(this.player2).toHavePromptButton(this.fingerOfJade.name);
            expect(this.player2).toHavePromptButton(this.tattooedWanderer.name);
            expect(this.player2).toHavePromptButton(this.kamiUnleashed.name);
            expect(this.player2).toHavePromptButton(this.censure.name);
            expect(this.player2).toHavePromptButton(this.levy.name);
            expect(this.player2).toHavePromptButton('Done');

            this.player2.clickPrompt(this.fingerOfJade.name);
            expect(this.player2).toHavePrompt('Select up to 3 cards to take');
            expect(this.player2).not.toHavePromptButton(this.assassination.name);
            expect(this.player2).not.toHavePromptButton(this.fingerOfJade.name);
            expect(this.player2).toHavePromptButton(this.tattooedWanderer.name);
            expect(this.player2).toHavePromptButton(this.kamiUnleashed.name);
            expect(this.player2).toHavePromptButton(this.censure.name);
            expect(this.player2).toHavePromptButton(this.levy.name);
            expect(this.player2).toHavePromptButton('Done');

            this.player2.clickPrompt(this.tattooedWanderer.name);
            expect(this.getChatLogs(5)).toContain(
                'player2 takes Assassination, Finger of Jade and Tattooed Wanderer from player1\'s deck'
            );
            expect(this.player2).toHavePrompt('Which card do you want to be on top?');
            expect(this.player2).not.toHavePromptButton(this.assassination.name);
            expect(this.player2).not.toHavePromptButton(this.fingerOfJade.name);
            expect(this.player2).not.toHavePromptButton(this.tattooedWanderer.name);
            expect(this.player2).toHavePromptButton(this.kamiUnleashed.name);
            expect(this.player2).toHavePromptButton(this.censure.name);
            expect(this.player2).toHavePromptButton(this.levy.name);

            this.player2.clickPrompt(this.kamiUnleashed.name);
            expect(this.player2).toHavePrompt('Which card do you want to be the second card?');
            expect(this.player2).not.toHavePromptButton(this.assassination.name);
            expect(this.player2).not.toHavePromptButton(this.fingerOfJade.name);
            expect(this.player2).not.toHavePromptButton(this.tattooedWanderer.name);
            expect(this.player2).not.toHavePromptButton(this.kamiUnleashed.name);
            expect(this.player2).toHavePromptButton(this.censure.name);
            expect(this.player2).toHavePromptButton(this.levy.name);

            this.player2.clickPrompt(this.censure.name);
            expect(this.getChatLogs(5)).toContain('player2 returns 3 cards to the top of player1\'s deck');
            expect(this.getChatLogs(5)).toContain('player1 has broken Shachihoko Bay!');
            expect(this.assassination.location).toBe('removed from game');
            expect(this.fingerOfJade.location).toBe('removed from game');
            expect(this.tattooedWanderer.location).toBe('removed from game');

            expect(this.kamiUnleashed.location).toBe('conflict deck');
            expect(this.censure.location).toBe('conflict deck');
            expect(this.levy.location).toBe('conflict deck');
            expect(this.player1.conflictDeck[0]).toBe(this.kamiUnleashed);
            expect(this.player1.conflictDeck[1]).toBe(this.censure);
            expect(this.player1.conflictDeck[2]).toBe(this.levy);
            expect(this.player1.conflictDeck[3]).toBe(this.banzai);
        });

        it('the stolen cards are playable', function () {
            this.player2.clickCard(this.shachihokoBay);
            /* steals */
            this.player2.clickPrompt(this.kamiUnleashed.name);
            this.player2.clickPrompt(this.fingerOfJade.name);
            this.player2.clickPrompt(this.levy.name);
            /* returns, the last card is placed without a prompt */
            this.player2.clickPrompt(this.assassination.name);
            this.player2.clickPrompt(this.tattooedWanderer.name);
            expect(this.player1.conflictDeck.slice(0, 3)).toEqual([this.assassination, this.tattooedWanderer, this.censure]);
            /* finish conflict */
            this.player1.clickPrompt('No');
            this.player1.clickPrompt('Gain 2 Honor');

            this.player1.pass();
            this.player2.clickCard(this.kamiUnleashed);
            expect(this.player2).toHavePrompt('Choose additional fate');
            this.player2.clickPrompt('0');
            expect(this.kamiUnleashed.location).toBe('play area');
            expect(this.kamiUnleashed.controller).toBe(this.player2.player);

            this.player1.pass();
            this.player2.clickCard(this.fingerOfJade);
            expect(this.player2).toHavePrompt('Finger of Jade');
            this.player2.clickCard(this.kamiUnleashed);
            expect(this.fingerOfJade.location).toBe('play area');
            expect(this.fingerOfJade.controller).toBe(this.player2.player);

            this.player1.pass();
            this.player2.clickCard(this.levy);
            expect(this.player1).toHavePrompt('Levy');
            expect(this.player1).toHavePromptButton('Give your opponent 1 fate');

            this.player1.clickPrompt('Give your opponent 1 fate');
            expect(this.levy.location).toBe('conflict discard pile');
            expect(this.player1.player.conflictDiscardPile).toContain(this.levy);
            expect(this.player2.player.conflictDiscardPile).not.toContain(this.levy);
        });
    });
});
