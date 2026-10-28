describe('Disloyal Oathkeeper', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-whisperer', 'isawa-tadaka'],
                    hand: ['way-of-the-crane', 'against-the-waves', 'fine-katana', 'political-rival', 'levy-2']
                },
                player2: {
                    inPlay: ['disloyal-oathkeeper', 'doji-challenger'],
                    hand: ['way-of-the-dragon', 'way-of-the-crane']
                }
            });

            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.isawaTadaka = this.player1.findCardByName('isawa-tadaka');
            this.crane = this.player1.findCardByName('way-of-the-crane');
            this.waves = this.player1.findCardByName('against-the-waves');
            this.katana = this.player1.findCardByName('fine-katana');
            this.rival = this.player1.findCardByName('political-rival');

            this.levy = this.player1.findCardByName('levy-2');
            this.oathkeeper = this.player2.findCardByName('disloyal-oathkeeper');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.dragon = this.player2.findCardByName('way-of-the-dragon');
            this.crane2 = this.player2.findCardByName('way-of-the-crane');

            this.player1.pass();
            this.player2.playAttachment(this.dragon, this.oathkeeper);
        });

        it('should react to an opponent\'s event and put it underneath self', function () {
            this.player1.clickCard(this.crane);
            this.player1.clickCard(this.whisperer);

            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.oathkeeper);

            this.player2.clickCard(this.oathkeeper);
            expect(this.crane.isUnderneath(this.oathkeeper)).toBe(true);

            expect(this.getChatLogs(5)).toContain(
                'player2 uses Disloyal Oathkeeper to place Way of the Crane underneath Disloyal Oathkeeper'
            );
        });

        it('should put the event underneath faceup, visible to the opponent', function () {
            this.player1.clickCard(this.crane);
            this.player1.clickCard(this.whisperer);
            this.player2.clickCard(this.oathkeeper);
            expect(this.crane.isUnderneath(this.oathkeeper)).toBe(true);

            const seenByOpponent = this.crane.getSummary(this.player1.player, false);
            expect(seenByOpponent.facedown).toBe(false);
            expect(seenByOpponent.name).toBe('Way of the Crane');
        });

        it('event should be playable', function () {
            this.player1.clickCard(this.crane);
            this.player1.clickCard(this.whisperer);
            this.player2.clickCard(this.oathkeeper);

            this.player2.clickCard(this.crane);
            this.player2.clickCard(this.challenger);
            expect(this.challenger.isHonored).toBe(true);

            expect(this.getChatLogs(5)).toContain('player2 plays Way of the Crane to honor Doji Challenger');
        });

        it('should not react if you already have a card underneath', function () {
            this.player1.clickCard(this.crane);
            this.player1.clickCard(this.whisperer);
            this.player2.clickCard(this.oathkeeper);
            expect(this.crane.isUnderneath(this.oathkeeper)).toBe(true);
            this.player2.pass();

            this.player1.clickCard(this.waves);
            this.player1.clickCard(this.isawaTadaka);
            expect(this.player2).toHavePrompt('Action Window');
        });

        it('should not react to an opponent\'s ephemeral event', function () {
            this.player1.clickCard(this.levy);
            this.player2.clickPrompt('Give your opponent 1 fate');

            expect(this.player2).toHavePrompt('Action Window');
            expect(this.levy.location).toBe('removed from game');
        });

        it('should not react to an opponent\'s attachment', function () {
            this.player1.clickCard(this.katana);
            this.player1.clickCard(this.whisperer);

            expect(this.player2).toHavePrompt('Action Window');
        });

        it('should not react to an opponent\'s character', function () {
            this.player1.clickCard(this.rival);
            this.player1.clickPrompt('0');

            expect(this.player2).toHavePrompt('Action Window');
        });

        it('should not react to your own events', function () {
            this.player1.pass();
            this.player2.clickCard(this.crane2);
            this.player2.clickCard(this.challenger);

            expect(this.player1).toHavePrompt('Action Window');
        });
    });
});

describe('Disloyal Oathkeeper after a change of control', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['disloyal-oathkeeper', 'matsu-berserker'],
                    hand: ['fine-katana', 'banzai']
                },
                player2: {
                    inPlay: ['doji-whisperer'],
                    hand: ['seize-the-mind']
                }
            });
            this.oathkeeper = this.player1.findCardByName('disloyal-oathkeeper');
            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.katana = this.player1.findCardByName('fine-katana');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.whisperer.fate = 3;
            this.player1.player.placeUnderneath(this.katana, this.oathkeeper);
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.berserker],
                defenders: [this.whisperer]
            });
            this.player2.clickCard('seize-the-mind');
            this.player2.clickCard(this.oathkeeper);
            this.player2.clickCard(this.whisperer);
            this.player2.clickPrompt('3');
        });

        it('still counts the card under it, whoever placed it', function () {
            expect(this.oathkeeper.controller).toBe(this.player2.player);
            this.player1.clickCard('banzai');
            this.player1.clickCard(this.berserker);
            this.player1.clickPrompt('Done');
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.getChatLogs(4)).toContain('player1 plays Banzai! to grant 2 military skill to Matsu Berserker');
        });
    });
});

describe('Disloyal Oathkeeper\'s reaction gained by Shosuro Deceiver', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-whisperer'],
                    hand: ['way-of-the-crane']
                },
                player2: {
                    inPlay: ['disloyal-oathkeeper', 'shosuro-deceiver'],
                    conflictDiscard: ['banzai']
                }
            });
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.crane = this.player1.findCardByName('way-of-the-crane');
            this.oathkeeper = this.player2.findCardByName('disloyal-oathkeeper');
            this.deceiver = this.player2.findCardByName('shosuro-deceiver');
            this.oathkeeper.dishonor();
            this.player2.player.placeUnderneath(this.player2.findCardByName('banzai'), this.oathkeeper);
            this.game.checkGameState(true);
        });

        it('checks and fills the Deceiver\'s own cards underneath', function () {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.whisperer],
                defenders: [this.oathkeeper, this.deceiver]
            });
            this.player2.pass();
            this.player1.clickCard(this.crane);
            this.player1.clickCard(this.whisperer);
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.deceiver);
            this.player2.clickCard(this.deceiver);
            expect(this.crane.isUnderneath(this.deceiver)).toBe(true);
        });
    });
});
