describe('Mantra of Water', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['brash-samurai', { card: 'togashi-initiate', bowed: true }]
                },
                player2: {
                    inPlay: [
                        { card: 'togashi-initiate', bowed: true },
                        { card: 'doji-whisperer', bowed: true },
                        { card: 'ikoma-prodigy', bowed: true },
                        'matsu-berserker'
                    ],
                    hand: ['mantra-of-water', 'tattooed-wanderer']
                }
            });
            this.brash = this.player1.findCardByName('brash-samurai');
            this.enemyInitiate = this.player1.findCardByName('togashi-initiate');
            this.initiate = this.player2.findCardByName('togashi-initiate');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.prodigy = this.player2.findCardByName('ikoma-prodigy');
            this.berserker = this.player2.findCardByName('matsu-berserker');
            this.mantra = this.player2.findCardByName('mantra-of-water');
            this.player2.reduceDeckToNumber('conflict deck', 5);
            this.player1.pass();
            this.player2.clickCard('tattooed-wanderer');
            this.player2.clickPrompt('Play Tattooed Wanderer as an attachment');
            this.player2.clickCard(this.whisperer);
            expect(this.whisperer.attachments.length).toBe(1);
            this.noMoreActions();
        });

        it('readies a Monk character and draws 1 card after the opponent declares a Water conflict', function() {
            this.initiateConflict({
                type: 'military',
                ring: 'water',
                attackers: [this.brash]
            });
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.mantra);
            this.player2.clickCard(this.mantra);
            expect(this.player2).toBeAbleToSelect(this.initiate);
            expect(this.player2).toBeAbleToSelect(this.enemyInitiate);
            expect(this.player2).toBeAbleToSelect(this.whisperer);
            expect(this.player2).not.toBeAbleToSelect(this.prodigy);
            expect(this.player2).not.toBeAbleToSelect(this.berserker);
            this.player2.clickCard(this.initiate);
            expect(this.initiate.bowed).toBe(false);
            expect(this.player2.hand.length).toBe(1);
            expect(this.player2.conflictDeck.length).toBe(4);
            expect(this.getChatLogs(5)).toContain('player2 plays Mantra of Water to ready Togashi Initiate and draw a card');
        });

        it('can ready a character with a Monk attachment', function() {
            this.initiateConflict({
                type: 'military',
                ring: 'water',
                attackers: [this.brash]
            });
            this.player2.clickCard(this.mantra);
            this.player2.clickCard(this.whisperer);
            expect(this.whisperer.bowed).toBe(false);
            expect(this.player2.hand.length).toBe(1);
        });

        it('does not trigger after the opponent declares a conflict with another ring', function() {
            this.initiateConflict({
                type: 'military',
                ring: 'fire',
                attackers: [this.brash]
            });
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.player2).toHavePrompt('Choose defenders');
            expect(this.game.currentConflict.ring.element).toBe('fire');
        });

        it('does not trigger after you declare a Water conflict', function() {
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                ring: 'water',
                attackers: [this.berserker]
            });
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.player1).toHavePrompt('Choose defenders');
            expect(this.game.currentConflict.ring.element).toBe('water');
        });
    });
});

describe('Mantra of Water without a bowed Monk', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['brash-samurai']
                },
                player2: {
                    inPlay: ['togashi-initiate'],
                    hand: ['mantra-of-water']
                }
            });
            this.brash = this.player1.findCardByName('brash-samurai');
            this.initiate = this.player2.findCardByName('togashi-initiate');
            this.noMoreActions();
        });

        // ruling #280: it needs a bowed Monk (or a character with a Monk attachment) to target
        it('cannot be played when no Monk character is bowed', function() {
            this.initiateConflict({
                type: 'military',
                ring: 'water',
                attackers: [this.brash]
            });
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.player2).toHavePrompt('Choose defenders');
            expect(this.game.currentConflict.ring.element).toBe('water');
            expect(this.initiate.bowed).toBe(false);
        });
    });
});
