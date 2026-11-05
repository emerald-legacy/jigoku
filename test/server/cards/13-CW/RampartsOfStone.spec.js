describe('Ramparts of Stone', function() {
    integration(function() {
        describe('Ramparts of stone\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shinjo-outrider', 'aggressive-moto', 'iuchi-wayfinder'],
                        hand: ['assassination', 'finger-of-jade', 'court-games', 'fine-katana']
                    },
                    player2: {
                        inPlay: ['doji-challenger', 'doji-whisperer'],
                        hand: ['steward-of-law', 'mirumoto-s-fury', 'ramparts-of-stone', 'ornate-fan']
                    }
                });
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['shinjo-outrider', 'aggressive-moto'],
                    defenders: ['doji-whisperer']
                });
                this.outrider = this.player1.findCardByName('shinjo-outrider');
                this.moto = this.player1.findCardByName('aggressive-moto');
                this.wayfinder = this.player1.findCardByName('iuchi-wayfinder');
                this.fingerOfJade = this.player1.findCardByName('finger-of-jade');
                this.courtGames = this.player1.findCardByName('court-games');
                this.katana = this.player1.findCardByName('fine-katana');

                this.ramparts = this.player2.findCardByName('ramparts-of-stone');
                this.whisperer = this.player2.findCardByName('doji-whisperer');
                this.challenger = this.player2.findCardByName('doji-challenger');
            });

            it('should prompt the attacker to discard or bow character', function() {
                this.player2.clickCard(this.ramparts);
                expect(this.player1).toHavePrompt('Ramparts of Stone');
                expect(this.player1.currentButtons).toContain('Bow all participating characters');
                expect(this.player1.currentButtons).toContain('Discard three cards from hand');
            });

            it('should only bow participating character for that option', function() {
                this.player2.clickCard(this.ramparts);
                this.player1.clickPrompt('Bow all participating characters');
                expect(this.outrider.bowed).toBe(true);
                expect(this.moto.bowed).toBe(true);
                expect(this.wayfinder.bowed).toBe(false);
            });

            it('chosen cards should be discarded', function() {
                this.player2.clickCard(this.ramparts);
                this.player1.clickPrompt('Discard three cards from hand');
                this.player1.clickCard(this.fingerOfJade);
                this.player1.clickCard(this.katana);
                this.player1.clickCard(this.courtGames);
                this.player1.clickPrompt('Done');
                expect(this.fingerOfJade.location).toBe('conflict discard pile');
                expect(this.katana.location).toBe('conflict discard pile');
                expect(this.courtGames.location).toBe('conflict discard pile');
            });

            it('cannot choose to bow when every participating character is bowed (#828)', function() {
                this.outrider.bow();
                this.moto.bow();
                this.player2.clickCard(this.ramparts);
                expect(this.player1).toHavePrompt('Ramparts of Stone');
                expect(this.player1.currentButtons).not.toContain('Bow all participating characters');
                expect(this.player1).toBeAbleToSelect(this.katana);
                this.player1.clickCard(this.fingerOfJade);
                this.player1.clickCard(this.katana);
                this.player1.clickCard(this.courtGames);
                this.player1.clickPrompt('Done');
                expect(this.katana.location).toBe('conflict discard pile');
                expect(this.wayfinder.bowed).toBe(false);
            });

            it('cannot choose to discard with an empty hand (#828)', function() {
                for(const card of [this.fingerOfJade, this.courtGames, this.katana, this.player1.findCardByName('assassination')]) {
                    this.player1.moveCard(card, 'conflict discard pile');
                }
                this.player2.clickCard(this.ramparts);
                expect(this.player1).not.toHavePrompt('Ramparts of Stone');
                expect(this.outrider.bowed).toBe(true);
                expect(this.moto.bowed).toBe(true);
                expect(this.getChatLogs(3)).toContain('player2 plays Ramparts of Stone to bow Shinjo Outrider and Aggressive Moto');
            });

            it('may discard the last two cards instead of bowing (#829)', function() {
                this.player1.moveCard(this.fingerOfJade, 'conflict discard pile');
                this.player1.moveCard('assassination', 'conflict discard pile');
                this.player2.clickCard(this.ramparts);
                this.player1.clickPrompt('Discard three cards from hand');
                expect(this.player1.hand.length).toBe(0);
                expect(this.katana.location).toBe('conflict discard pile');
                expect(this.courtGames.location).toBe('conflict discard pile');
                expect(this.outrider.bowed).toBe(false);
                expect(this.getChatLogs(3)).toContain('player1 discards Court Games and Fine Katana');
            });

            it('finger of jade should not be able to cancel it', function() {
                this.player2.pass();
                this.player1.playAttachment(this.fingerOfJade, this.outrider);
                this.player2.clickCard(this.ramparts);
                this.player1.clickPrompt('Bow all participating characters');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should always be the attacking player that the card effects', function() {
                this.noMoreActions();
                this.player1.clickPrompt('Yes');
                this.player1.clickPrompt('Gain 2 honor');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.challenger],
                    defenders: [this.wayfinder],
                    ring: 'fire'
                });
                this.player1.pass();
                this.player2.clickCard(this.ramparts);
                expect(this.player2).toHavePrompt('Ramparts of Stone');
                expect(this.player2.currentButtons).toContain('Bow all participating characters');
                expect(this.player2.currentButtons).toContain('Discard three cards from hand');
            });

            it('makes the attacking player discard when they play it', function() {
                this.noMoreActions();
                this.player1.clickPrompt('Yes');
                this.player1.clickPrompt('Gain 2 honor');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.challenger],
                    defenders: [this.wayfinder],
                    ring: 'fire'
                });
                const player1Hand = this.player1.hand.length;
                this.player1.pass();
                this.player2.clickCard(this.ramparts);
                this.player2.clickPrompt('Discard three cards from hand');
                expect(this.player2.hand.length).toBe(0);
                expect(this.player1.hand.length).toBe(player1Hand);
            });
        });
    });
});
