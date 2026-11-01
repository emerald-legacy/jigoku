describe('Riddles of the Henshin', function () {
    integration(function () {
        describe('with two monks', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['ancient-master', 'asako-azunami', 'togashi-initiate'],
                        hand: ['riddles-of-the-henshin']
                    },
                    player2: {
                        inPlay: ['doji-whisperer', 'brash-samurai'],
                        hand: []
                    }
                });
                this.master = this.player1.findCardByName('ancient-master');
                this.initiate = this.player1.findCardByName('togashi-initiate');
                this.azunami = this.player1.findCardByName('asako-azunami');
                this.brash = this.player2.findCardByName('brash-samurai');
                this.whisperer = this.player2.findCardByName('doji-whisperer');
                this.riddles = this.player1.findCardByName('riddles-of-the-henshin');
            });

            it('should prompt you to pick claimed rings', function () {
                this.player1.claimRing('air');
                this.player1.claimRing('fire');
                this.player1.claimRing('earth');
                this.player1.claimRing('void');

                this.player1.clickCard(this.riddles);
                expect(this.player1).toHavePrompt('Choose the first ring to resolve');
                expect(this.player1).toBeAbleToSelectRing('air');
                expect(this.player1).toBeAbleToSelectRing('earth');
                expect(this.player1).toBeAbleToSelectRing('fire');
                expect(this.player1).toBeAbleToSelectRing('void');
                expect(this.player1).not.toBeAbleToSelectRing('water');

                this.player1.clickRing('fire');

                expect(this.player1).toHavePrompt('Choose the second ring to resolve');
                expect(this.player1).toBeAbleToSelectRing('air');
                expect(this.player1).toBeAbleToSelectRing('earth');
                expect(this.player1).not.toBeAbleToSelectRing('fire');
                expect(this.player1).toBeAbleToSelectRing('void');
                expect(this.player1).not.toBeAbleToSelectRing('water');
                expect(this.player1).toHavePromptButton('Done');

                this.player1.clickRing('air');

                expect(this.player1).toHavePrompt('Fire Ring');
                this.player1.clickCard(this.brash);
                this.player1.clickPrompt('Dishonor Brash Samurai');
                expect(this.player1).toHavePrompt('Air Ring');
                this.player1.clickPrompt('Gain 2 Honor');
                expect(this.getChatLogs(5)).toContain('player1 plays Riddles of the Henshin to resolve ring effects');
                expect(this.getChatLogs(5)).toContain('player1 resolves Fire Ring and Air Ring');
                expect(this.getChatLogs(5)).toContain('player1 resolves the fire ring, dishonoring Brash Samurai');
                expect(this.getChatLogs(5)).toContain('player1 resolves the air ring, gaining 2 honor');

                expect(this.player2).toHavePrompt('Action Window');
            });

            it('should resolve if you cancel mid-prompt', function () {
                this.player1.claimRing('air');
                this.player1.claimRing('fire');
                this.player1.claimRing('earth');
                this.player1.claimRing('void');

                this.player1.clickCard(this.riddles);
                expect(this.player1).toHavePrompt('Choose the first ring to resolve');
                expect(this.player1).toBeAbleToSelectRing('air');
                expect(this.player1).toBeAbleToSelectRing('earth');
                expect(this.player1).toBeAbleToSelectRing('fire');
                expect(this.player1).toBeAbleToSelectRing('void');
                expect(this.player1).not.toBeAbleToSelectRing('water');

                this.player1.clickRing('fire');

                expect(this.player1).toBeAbleToSelectRing('air');
                expect(this.player1).toBeAbleToSelectRing('earth');
                expect(this.player1).not.toBeAbleToSelectRing('fire');
                expect(this.player1).toBeAbleToSelectRing('void');
                expect(this.player1).not.toBeAbleToSelectRing('water');
                expect(this.player1).toHavePromptButton('Done');

                this.player1.clickPrompt('Done');

                expect(this.player1).toHavePrompt('Fire Ring');
                this.player1.clickCard(this.brash);
                this.player1.clickPrompt('Dishonor Brash Samurai');
                expect(this.getChatLogs(5)).toContain('player1 plays Riddles of the Henshin to resolve ring effects');
                expect(this.getChatLogs(5)).toContain('player1 resolves Fire Ring');
                expect(this.getChatLogs(5)).toContain('player1 resolves the fire ring, dishonoring Brash Samurai');

                expect(this.player2).toHavePrompt('Action Window');
            });

            it('should allow ring replacement effects', function () {
                this.player1.claimRing('water');
                this.player1.clickCard(this.riddles);
                this.player1.clickRing('water');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.azunami);
                this.player1.clickCard(this.azunami);
                expect(this.player1).toHavePrompt('Asako Azunami');
            });

            it('should not be playable if you have no claimed rings', function () {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.riddles);
                expect(this.player1).toHavePrompt('Action Window');
            });
        });

        describe('with Done before the maximum', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['ancient-master', 'togashi-initiate', 'togashi-initiate'],
                        hand: ['riddles-of-the-henshin']
                    },
                    player2: {
                        inPlay: ['brash-samurai']
                    }
                });
                this.brash = this.player2.findCardByName('brash-samurai');
                this.riddles = this.player1.findCardByName('riddles-of-the-henshin');
            });

            it('should resolve the rings in the order picked', function () {
                this.player1.claimRing('air');
                this.player1.claimRing('fire');
                this.player1.claimRing('earth');

                this.player1.clickCard(this.riddles);
                this.player1.clickRing('air');
                this.player1.clickRing('fire');
                expect(this.player1).toHavePrompt('Choose the third ring to resolve');
                this.player1.clickPrompt('Done');

                expect(this.player1).toHavePrompt('Air Ring');
                this.player1.clickPrompt('Gain 2 Honor');
                expect(this.player1).toHavePrompt('Fire Ring');
            });
        });

        describe('Max 1 per round', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['togashi-initiate'],
                        hand: ['riddles-of-the-henshin', 'riddles-of-the-henshin']
                    }
                });
                [this.riddles, this.riddles2] = this.player1.filterCardsByName('riddles-of-the-henshin');
                this.player1.claimRing('earth');
            });

            it('cannot play a second copy in the same round', function () {
                this.player1.clickCard(this.riddles);
                this.player1.clickRing('earth');
                expect(this.riddles.location).toBe('conflict discard pile');
                this.player2.pass();

                this.player1.clickCard(this.riddles2);
                expect(this.riddles2.location).toBe('hand');
            });
        });
    });
});

describe('Riddles of the Henshin played by the second player', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-whisperer']
                },
                player2: {
                    inPlay: ['ancient-master', 'togashi-initiate', 'brash-samurai'],
                    hand: ['riddles-of-the-henshin']
                }
            });
            this.player1.player.optionSettings.orderForcedAbilities = true;
            this.player2.claimRing('water');
            this.player2.claimRing('earth');
        });

        it('resolves the rings in the chosen order, each of which may be passed', function() {
            this.player1.pass();
            this.player2.clickCard('riddles-of-the-henshin');
            this.player2.clickRing('water');
            this.player2.clickRing('earth');
            expect(this.player1).not.toHavePrompt('Choose an effect to be resolved');
            expect(this.player2).toHavePrompt('Choose character to bow or unbow');
            expect(this.player2).toHavePromptButton('Don\'t resolve');
            this.player2.clickPrompt('Don\'t resolve');
            expect(this.player2).toHavePromptButton('Draw a card and opponent discards');
            this.player2.clickPrompt('Don\'t resolve');
            expect(this.getChatLogs(3)).toContain('player2 chooses not to resolve the water ring');
            expect(this.getChatLogs(3)).toContain('player2 chooses not to resolve the earth ring');
        });
    });
});
