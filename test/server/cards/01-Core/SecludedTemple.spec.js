describe('Secluded Temple', function () {
    integration(function () {
        describe('when the opponent controls more characters', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        inPlay: ['doji-whisperer'],
                        dynastyDiscard: ['secluded-temple']
                    },
                    player2: {
                        inPlay: ['matsu-berserker', 'serene-warrior', 'valiant-oathkeeper']
                    }
                });
                this.whisperer = this.player1.findCardByName('doji-whisperer');
                this.whisperer.fate = 1;
                this.temple = this.player1.placeCardInProvince('secluded-temple', 'province 1');

                this.berserker = this.player2.findCardByName('matsu-berserker');
                this.berserker.fate = 2;
                this.sereneWarrior = this.player2.findCardByName('serene-warrior');
                this.sereneWarrior.fate = 1;
                this.oathkeeper = this.player2.findCardByName('valiant-oathkeeper');
            });

            it('does not trigger when another phase begins', function () {
                this.noMoreActions();

                expect(this.game.currentPhase).toBe('draw');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });

            it('makes the opponent remove 1 fate from a character of theirs with fate after the conflict phase begins', function () {
                this.noMoreActions();
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');

                expect(this.game.currentPhase).toBe('conflict');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.temple);

                this.player1.clickCard(this.temple);
                expect(this.player2).toHavePrompt('Choose a character to remove a fate from');
                expect(this.player2).toBeAbleToSelect(this.berserker);
                expect(this.player2).toBeAbleToSelect(this.sereneWarrior);
                expect(this.player2).not.toBeAbleToSelect(this.oathkeeper);
                expect(this.player2).not.toBeAbleToSelect(this.whisperer);

                this.player2.clickCard(this.sereneWarrior);
                expect(this.sereneWarrior.fate).toBe(0);
                expect(this.berserker.fate).toBe(2);
                expect(this.whisperer.fate).toBe(1);
            });
        });

        describe('when the opponent does not control more characters', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        inPlay: ['doji-whisperer', 'samurai-of-integrity'],
                        dynastyDiscard: ['secluded-temple']
                    },
                    player2: {
                        inPlay: ['matsu-berserker', 'serene-warrior']
                    }
                });
                this.temple = this.player1.placeCardInProvince('secluded-temple', 'province 1');
                this.berserker = this.player2.findCardByName('matsu-berserker');
                this.berserker.fate = 2;
                this.sereneWarrior = this.player2.findCardByName('serene-warrior');
                this.sereneWarrior.fate = 1;
            });

            it('does not trigger when both control as many characters', function () {
                this.noMoreActions();
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');

                expect(this.game.currentPhase).toBe('conflict');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.berserker.fate).toBe(2);
                expect(this.sereneWarrior.fate).toBe(1);
            });

            it('does not trigger when the opponent controls fewer characters', function () {
                this.player2.moveCard(this.sereneWarrior, 'dynasty discard pile');
                this.noMoreActions();
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');

                expect(this.game.currentPhase).toBe('conflict');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.berserker.fate).toBe(2);
            });
        });
    });
});
