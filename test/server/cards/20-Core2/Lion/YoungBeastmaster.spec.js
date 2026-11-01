describe('Young Beastmaster', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['young-beastmaster', 'matsu-berserker'],
                    dynastyDiscard: ['akodo-toturi', 'ikoma-prodigy', 'doji-challenger']
                },
                player2: {
                    inPlay: ['doji-whisperer']
                }
            });
            this.beastmaster = this.player1.findCardByName('young-beastmaster');
            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.toturi = this.player1.findCardByName('akodo-toturi');
            this.prodigy = this.player1.findCardByName('ikoma-prodigy');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.player1.moveCard(this.challenger, 'dynasty deck');
            this.player1.moveCard(this.prodigy, 'dynasty deck');
            this.player1.moveCard(this.toturi, 'dynasty deck');
        });

        it('discards the top 2 cards of your dynasty deck and gets +X military, X being the highest printed cost', function() {
            expect(this.player1.player.dynastyDeck.slice(0, 3)).toEqual([this.toturi, this.prodigy, this.challenger]);
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.beastmaster]
            });
            expect(this.player1).toHavePrompt('Triggered Abilities');
            this.player1.clickCard(this.beastmaster);

            expect(this.toturi.location).toBe('dynasty discard pile');
            expect(this.prodigy.location).toBe('dynasty discard pile');
            expect(this.challenger.location).toBe('dynasty deck');
            expect(this.player1.player.dynastyDeck[0]).toBe(this.challenger);
            expect(this.beastmaster.getMilitarySkill()).toBe(7);
            expect(this.getChatLogs(3)).toContain('player1 uses Young Beastmaster, discarding Akodo Toturi and Ikoma Prodigy to give Young Beastmaster +5military');
        });

        it('lasts until the end of the conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.beastmaster]
            });
            this.player1.clickCard(this.beastmaster);
            this.player2.assignDefenders([]);
            expect(this.beastmaster.getMilitarySkill()).toBe(7);
            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player1 won a military conflict 7 vs 0');
            this.player1.clickPrompt('No');
            this.player1.clickPrompt('Gain 2 Honor');
            expect(this.game.currentConflict).toBeNull();
            expect(this.beastmaster.getMilitarySkill()).toBe(2);
        });

        it('does not react when another character is declared as an attacker', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.berserker]
            });
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player2).toHavePrompt('Choose defenders');
            expect(this.toturi.location).toBe('dynasty deck');
        });
    });
});

describe('Young Beastmaster with a single card in the dynasty deck', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['young-beastmaster']
                },
                player2: {
                    inPlay: ['doji-whisperer']
                }
            });
            this.beastmaster = this.player1.findCardByName('young-beastmaster');
            this.player1.reduceDeckToNumber('dynasty deck', 1);
            this.lastCard = this.player1.player.dynastyDeck[0];
        });

        it('should not trigger, as the cost can\'t be paid in full', function() {
            expect(this.player1.player.dynastyDeck.length).toBe(1);
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.beastmaster]
            });
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player2).toHavePrompt('Choose defenders');
            expect(this.lastCard.location).toBe('dynasty deck');
        });
    });
});
