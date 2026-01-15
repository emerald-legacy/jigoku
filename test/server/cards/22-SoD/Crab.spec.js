describe('SoD - Crab', function () {
    integration(function () {
        describe('A Bad Death', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['silent-skirmisher', 'agasha-swordsmith'],
                        hand: ['a-bad-death']
                    },
                    player2: {
                        inPlay: ['togashi-yokuni'],
                        hand: ['ornate-fan', 'fine-katana', 'banzai']
                    }
                });

                this.skirmisher = this.player1.findCardByName('silent-skirmisher');
                this.swordsmith = this.player1.findCardByName('agasha-swordsmith');
                this.badDeath = this.player1.findCardByName('a-bad-death');
                this.yokuni = this.player2.findCardByName('togashi-yokuni');
                this.yokuni.honor();
            });

            it('should prompt to choose a card to discard from randomly chosen cards in your opponent\'s hand', function () {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.skirmisher, this.swordsmith],
                    defenders: [this.yokuni]
                });
                this.player2.pass();
                this.player1.pass();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.badDeath);

                this.player1.clickCard(this.badDeath);
                this.player1.clickCard(this.swordsmith);

                expect(this.player1).toHavePrompt('Select a card:');
                let matchingButtons = this.player1.currentPrompt().buttons.filter(button =>
                    ['Ornate Fan', 'Fine Katana', 'Banzai!'].includes(button.text)
                );
                expect(matchingButtons.length).toBe(1);
                expect(this.player1.currentPrompt().buttons.length).toBe(1);
                let conflictDiscardPileSize = this.player2.player.conflictDiscardPile.size();
                let hand = this.player2.player.hand.size();
                this.player1.clickPrompt(matchingButtons[0].text);
                expect(this.player2.player.conflictDiscardPile.size()).toBe(conflictDiscardPileSize + 1);
                expect(this.player2.player.hand.size()).toBe(hand - 1);
                expect(this.getChatLogs(5)).toContain('player1 plays A Bad Death, dishonoring and sacrificing Agasha Swordsmith to look at 1 random card in player2\'s hand');
                expect(this.getChatLogs(5)).toContain('player1 chooses ' + matchingButtons[0].text + ' to be discarded');
                expect(this.getChatLogs(5)).toContain('A Bad Death sees ' + matchingButtons[0].text);
            });

            it('should prompt to choose a card to discard from randomly chosen cards in your opponent\'s hand', function () {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.skirmisher, this.swordsmith],
                    defenders: [this.yokuni]
                });
                this.player2.pass();

                this.player1.clickCard(this.skirmisher);
                this.player1.clickCard(this.swordsmith);

                this.player2.pass();
                this.player1.pass();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.badDeath);

                this.player1.clickCard(this.badDeath);
                this.player1.clickCard(this.skirmisher);

                expect(this.player1).toHavePrompt('Select a card:');
                let matchingButtons = this.player1.currentPrompt().buttons.filter(button =>
                    ['Ornate Fan', 'Fine Katana', 'Banzai!'].includes(button.text)
                );
                expect(matchingButtons.length).toBe(3);
                expect(this.player1.currentPrompt().buttons.length).toBe(3);
                let conflictDiscardPileSize = this.player2.player.conflictDiscardPile.size();
                let hand = this.player2.player.hand.size();
                this.player1.clickPrompt(matchingButtons[0].text);
                expect(this.player2.player.conflictDiscardPile.size()).toBe(conflictDiscardPileSize + 1);
                expect(this.player2.player.hand.size()).toBe(hand - 1);
                expect(this.getChatLogs(5)).toContain('player1 plays A Bad Death, dishonoring and sacrificing Silent Skirmisher to look at 3 random cards in player2\'s hand');
                expect(this.getChatLogs(5)).toContain('player1 chooses ' + matchingButtons[0].text + ' to be discarded');
                expect(this.getChatLogs(5)).toContain('A Bad Death sees ' + matchingButtons[0].text + ', ' + matchingButtons[1].text + ' and ' + matchingButtons[2].text);
            });
        });

        describe('Caretaker of The Dead Eyes', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['silent-skirmisher', 'agasha-swordsmith', 'caretaker-of-the-dead-eyes'],
                        hand: ['a-bad-death']
                    },
                    player2: {
                        inPlay: ['togashi-yokuni'],
                        hand: ['assassination']
                    }
                });

                this.skirmisher = this.player1.findCardByName('silent-skirmisher');
                this.swordsmith = this.player1.findCardByName('agasha-swordsmith');
                this.deadeyes = this.player1.findCardByName('caretaker-of-the-dead-eyes');
                this.yokuni = this.player2.findCardByName('togashi-yokuni');
                this.assassination = this.player2.findCardByName('assassination');

                this.skirmisher.dishonor();
                this.swordsmith.dishonor();
                this.yokuni.honor();
            });

            it('should rehonor and not cause honor loss', function () {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.skirmisher, this.swordsmith],
                    defenders: [this.yokuni]
                });
                const honor = this.player1.honor;

                this.player2.clickCard(this.assassination);
                this.player2.clickCard(this.skirmisher);

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.deadeyes);

                this.player1.clickCard(this.deadeyes);
                expect(this.skirmisher.location).toBe('dynasty discard pile');
                expect(this.player1.honor).toBe(honor);

                expect(this.getChatLogs(5)).toContain('player1 uses Caretaker of the Dead Eyes to honor Silent Skirmisher');
            });
        });

        describe('Dead Eyes', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['silent-skirmisher', 'agasha-swordsmith'],
                        hand: ['dead-eyes']
                    },
                    player2: {
                        inPlay: ['togashi-yokuni'],
                        hand: ['rout']
                    }
                });

                this.skirmisher = this.player1.findCardByName('silent-skirmisher');
                this.swordsmith = this.player1.findCardByName('agasha-swordsmith');
                this.deadeyes = this.player1.findCardByName('dead-eyes');
                this.yokuni = this.player2.findCardByName('togashi-yokuni');
                this.rout = this.player2.findCardByName('rout');

                this.yokuni.honor();
            });

            it('should work properly', function () {
                this.player1.clickCard(this.deadeyes);
                expect(this.player1).toBeAbleToSelect(this.skirmisher);
                expect(this.player1).not.toBeAbleToSelect(this.swordsmith);
                this.player1.clickCard(this.skirmisher);

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.skirmisher, this.swordsmith],
                    defenders: [this.yokuni]
                });
                this.player2.pass();

                let mil = this.skirmisher.getMilitarySkill();
                this.player1.clickCard(this.deadeyes);
                expect(this.skirmisher.getMilitarySkill()).toBe(mil + 2);

                expect(this.getChatLogs(5)).toContain('player1 uses Dead Eyes to grant +2military to Silent Skirmisher, prevent them from being moved home. They will be sacrificed if they don\'t win the conflict by enough skill');

                this.player2.clickCard(this.rout);
                expect(this.player2).not.toBeAbleToSelect(this.skirmisher);
                expect(this.player2).toBeAbleToSelect(this.swordsmith);

                this.player2.clickCard(this.swordsmith);

                this.noMoreActions();

                expect(this.skirmisher.location).toBe('dynasty discard pile');
                expect(this.getChatLogs(5)).toContain('Silent Skirmisher is sacrificed due to the delayed effect of Dead Eyes');
            });
        });

        describe('Reckless Assault', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['silent-skirmisher', 'agasha-swordsmith'],
                        hand: ['reckless-assault'],
                        conflictDiscard: ['under-the-new-moon']
                    },
                    player2: {
                        inPlay: ['togashi-yokuni', 'doji-challenger', 'brash-samurai']
                    }
                });

                this.skirmisher = this.player1.findCardByName('silent-skirmisher');
                this.swordsmith = this.player1.findCardByName('agasha-swordsmith');
                this.assault = this.player1.findCardByName('reckless-assault');
                this.yokuni = this.player2.findCardByName('togashi-yokuni');
                this.challenger = this.player2.findCardByName('doji-challenger');
                this.brash = this.player2.findCardByName('brash-samurai');
                this.moon = this.player1.findCardByName('under-the-new-moon');
                this.shamefulDisplay = this.player2.findCardByName('shameful-display', 'province 1');
                this.yokuni.honor();
            });

            it('should bow', function () {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.skirmisher]
                });
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.assault);
                this.player1.clickCard(this.assault);

                this.player1.clickCard(this.yokuni);
                this.player1.clickCard(this.challenger);

                this.player1.clickPrompt('Done');

                this.player2.clickPrompt('Done');

                expect(this.yokuni.bowed).toBe(true);
                expect(this.challenger.bowed).toBe(true);

                expect(this.getChatLogs(5)).toContain('player1 plays Reckless Assault to bow Togashi Yokuni and Doji Challenger if neither of them defend');
                expect(this.getChatLogs(5)).toContain('Togashi Yokuni and Doji Challenger are bowed due to the delayed effect of Reckless Assault');
            });

            it('should not bow', function () {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.skirmisher]
                });
                this.player1.clickCard(this.assault);

                this.player1.clickCard(this.yokuni);
                this.player1.clickCard(this.challenger);
                this.player1.clickPrompt('Done');

                this.player2.clickCard(this.yokuni);
                this.player2.clickPrompt('Done');

                expect(this.getChatLogs(5)).toContain('player1 plays Reckless Assault to bow Togashi Yokuni and Doji Challenger if neither of them defend');
                expect(this.getChatLogs(5)).not.toContain('Togashi Yokuni and Doji Challenger are bowed due to the delayed effect of Reckless Assault');

                expect(this.yokuni.bowed).toBe(false);
                expect(this.challenger.bowed).toBe(false);
            });

            it('should not trigger when new moon is in effect', function () {
                this.player1.moveCard(this.moon, 'hand');
                this.noMoreActions();

                this.player1.clickCard(this.moon);
                this.player1.clickPrompt('1');
                expect(this.player2).toHavePrompt('Choose Defenders');
                this.player2.clickPrompt('Done');

                this.player1.clickRing('fire');
                this.player1.clickCard(this.shamefulDisplay);
                this.player1.clickCard(this.skirmisher);
                this.player1.clickPrompt('Initiate Conflict');

                expect(this.player1).not.toHavePrompt('Triggered Abilities');

                expect(this.getChatLogs(5)).not.toContain('Togashi Yokuni and Doji Challenger are bowed due to the delayed effect of Reckless Assault');
            });
        });

        describe('Unbridled Assault', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['silent-skirmisher', 'agasha-swordsmith'],
                        hand: ['unbridled-rage']
                    },
                    player2: {
                        inPlay: ['togashi-yokuni'],
                        hand: ['rout']
                    }
                });

                this.skirmisher = this.player1.findCardByName('silent-skirmisher');
                this.swordsmith = this.player1.findCardByName('agasha-swordsmith');
                this.rage = this.player1.findCardByName('unbridled-rage');
                this.yokuni = this.player2.findCardByName('togashi-yokuni');
            });

            it('refuse duel', function () {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.skirmisher, this.swordsmith],
                    defenders: [this.yokuni]
                });
                this.player2.pass();

                let hand = this.player1.hand.length;
                this.player1.clickCard(this.rage);
                expect(this.player1).toBeAbleToSelect(this.skirmisher);
                expect(this.player1).not.toBeAbleToSelect(this.swordsmith);

                this.player1.clickCard(this.skirmisher);

                expect(this.player1).toBeAbleToSelect(this.yokuni);
                this.player1.clickCard(this.yokuni);

                expect(this.player2).toHavePrompt('Do you wish to refuse the duel?');
                expect(this.player2).toHavePromptButton('Yes');
                expect(this.player2).toHavePromptButton('No');

                this.player2.clickPrompt('Yes');

                expect(this.player1.hand.length).toBe(hand + 1); // draw 2
                expect(this.player1).toHavePrompt('Conflict Action Window');

                expect(this.getChatLogs(5)).toContain('player2 chooses to refuse the duel, allowing player1 to draw 2 cards and take an additional action');
            });

            it('accept duel', function () {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.skirmisher, this.swordsmith],
                    defenders: [this.yokuni]
                });
                this.player2.pass();

                let hand = this.player1.hand.length;
                this.player1.clickCard(this.rage);
                expect(this.player1).toBeAbleToSelect(this.skirmisher);
                expect(this.player1).not.toBeAbleToSelect(this.swordsmith);

                this.player1.clickCard(this.skirmisher);

                expect(this.player1).toBeAbleToSelect(this.yokuni);
                this.player1.clickCard(this.yokuni);

                this.player2.clickPrompt('No');

                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');

                expect(this.player1.hand.length).toBe(hand - 1);
                expect(this.player2).toHavePrompt('Conflict Action Window');

                expect(this.getChatLogs(5)).toContain('Duel Effect: prevent Silent Skirmisher from contributing to resolution of this conflict');
                expect(this.getChatLogs(5)).toContain('Military Air conflict - Attacker: 1 Defender: 5');
            });
        });
    });
});

