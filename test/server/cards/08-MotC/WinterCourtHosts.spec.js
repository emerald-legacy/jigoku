describe('Winter Court Hosts', function() {
    integration(function() {
        describe('Winter Court Hosts\' ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['winter-court-hosts'],
                        hand: [],
                        conflictDeck: ['for-shame', 'banzai', 'court-games'],
                        honor: 11
                    },
                    player2: {
                        inPlay: ['shiba-tetsu'],
                        hand: ['fine-katana', 'steward-of-law', 'banzai'],
                        honor: 7
                    }
                });

                this.winterCourt = this.player1.findCardByName('winter-court-hosts');
                this.steward = this.player2.findCardByName('steward-of-law');
                this.tetsu = this.player2.findCardByName('shiba-tetsu');

                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.winterCourt],
                    defenders: [this.tetsu]
                });
            });

            it('should trigger when your opponent plays a attachment', function() {
                this.player2.playAttachment('fine-katana', this.tetsu);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickCard(this.winterCourt);
                expect(this.getChatLogs(5)).toContain('player1 uses Winter Court Hosts to draw 1 card');
                expect(this.player1.hand.length).toBe(1);
            });

            it('should trigger for all card types and unlimited', function() {
                this.player2.playAttachment('fine-katana', this.tetsu);
                this.player1.clickCard(this.winterCourt);
                expect(this.player1.hand.length).toBe(1);

                this.player1.pass();
                this.player2.clickCard(this.steward);
                this.player2.clickPrompt('0');
                this.player2.clickPrompt('Conflict');
                this.player1.clickCard(this.winterCourt);
                expect(this.player1.hand.length).toBe(2);

                this.player1.pass();
                this.player2.clickCard('banzai');
                this.player2.clickCard(this.tetsu);
                this.player2.clickPrompt('Done');
                this.player1.clickCard(this.winterCourt);
                expect(this.player1.hand.length).toBe(3);
            });
        });
    });
});

describe('Winter Court Hosts when not more honorable', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['winter-court-hosts'],
                    hand: [],
                    honor: 10
                },
                player2: {
                    inPlay: ['shiba-tetsu'],
                    hand: ['fine-katana'],
                    honor: 10
                }
            });
            this.winterCourt = this.player1.findCardByName('winter-court-hosts');
            this.tetsu = this.player2.findCardByName('shiba-tetsu');
            this.katana = this.player2.findCardByName('fine-katana');
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.winterCourt],
                defenders: [this.tetsu]
            });
        });

        it('should not trigger when both players have the same honor', function() {
            this.player2.playAttachment(this.katana, this.tetsu);
            expect(this.katana.location).toBe('play area');
            expect(this.tetsu.attachments).toContain(this.katana);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.player1.hand.length).toBe(0);
        });
    });
});

describe('Winter Court Hosts when not participating or for own plays', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['winter-court-hosts', 'doji-whisperer'],
                    hand: ['banzai'],
                    honor: 11
                },
                player2: {
                    inPlay: ['shiba-tetsu'],
                    hand: ['fine-katana'],
                    honor: 7
                }
            });
            this.winterCourt = this.player1.findCardByName('winter-court-hosts');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.banzai = this.player1.findCardByName('banzai');
            this.tetsu = this.player2.findCardByName('shiba-tetsu');
            this.katana = this.player2.findCardByName('fine-katana');
            this.noMoreActions();
        });

        it('should not trigger when it is not participating', function() {
            this.initiateConflict({
                type: 'political',
                attackers: [this.whisperer],
                defenders: [this.tetsu]
            });
            expect(this.winterCourt.isParticipating()).toBe(false);
            this.player2.playAttachment(this.katana, this.tetsu);
            expect(this.tetsu.attachments).toContain(this.katana);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.player1.hand.length).toBe(1);
        });

        it('should not trigger when its controller plays a card', function() {
            this.initiateConflict({
                type: 'political',
                attackers: [this.winterCourt],
                defenders: [this.tetsu]
            });
            this.player2.pass();
            this.player1.clickCard(this.banzai);
            this.player1.clickCard(this.winterCourt);
            this.player1.clickPrompt('Done');
            expect(this.banzai.location).toBe('conflict discard pile');
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player2).toHavePrompt('Conflict Action Window');
            expect(this.player1.hand.length).toBe(0);
        });
    });
});
