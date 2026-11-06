describe('Mantra of Fire', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['brash-samurai', 'togashi-initiate']
                },
                player2: {
                    inPlay: ['togashi-initiate', 'doji-whisperer', 'matsu-berserker'],
                    hand: ['mantra-of-fire', 'tattooed-wanderer']
                }
            });
            this.brash = this.player1.findCardByName('brash-samurai');
            this.enemyInitiate = this.player1.findCardByName('togashi-initiate');
            this.initiate = this.player2.findCardByName('togashi-initiate');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.berserker = this.player2.findCardByName('matsu-berserker');
            this.mantra = this.player2.findCardByName('mantra-of-fire');
            this.player2.reduceDeckToNumber('conflict deck', 5);
            this.player1.pass();
            this.player2.clickCard('tattooed-wanderer');
            this.player2.clickPrompt('Play Tattooed Wanderer as an attachment');
            this.player2.clickCard(this.whisperer);
            expect(this.whisperer.attachments.length).toBe(1);
            this.noMoreActions();
        });

        it('places 1 fate on a Monk character and draws 1 card after the opponent declares a Fire conflict', function() {
            this.initiateConflict({
                type: 'military',
                ring: 'fire',
                attackers: [this.brash]
            });
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.mantra);
            this.player2.clickCard(this.mantra);
            expect(this.player2).toBeAbleToSelect(this.initiate);
            expect(this.player2).toBeAbleToSelect(this.enemyInitiate);
            expect(this.player2).toBeAbleToSelect(this.whisperer);
            expect(this.player2).not.toBeAbleToSelect(this.berserker);
            expect(this.player2).not.toBeAbleToSelect(this.brash);
            this.player2.clickCard(this.initiate);
            expect(this.initiate.fate).toBe(1);
            expect(this.player2.hand.length).toBe(1);
            expect(this.player2.conflictDeck.length).toBe(4);
            expect(this.getChatLogs(5)).toContain('player2 plays Mantra of Fire to add a fate to Togashi Initiate and draw a card');
        });

        it('can place the fate on a character with a Monk attachment', function() {
            this.initiateConflict({
                type: 'military',
                ring: 'fire',
                attackers: [this.brash]
            });
            this.player2.clickCard(this.mantra);
            this.player2.clickCard(this.whisperer);
            expect(this.whisperer.fate).toBe(1);
            expect(this.player2.hand.length).toBe(1);
        });

        it('does not trigger after the opponent declares a conflict with another ring', function() {
            this.initiateConflict({
                type: 'military',
                ring: 'water',
                attackers: [this.brash]
            });
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.player2).toHavePrompt('Choose defenders');
            expect(this.game.currentConflict.ring.element).toBe('water');
        });

        it('does not trigger after you declare a Fire conflict', function() {
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                ring: 'fire',
                attackers: [this.berserker]
            });
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.player1).toHavePrompt('Choose defenders');
            expect(this.game.currentConflict.ring.element).toBe('fire');
        });
    });
});

describe('Mantra of Fire after Elemental Fury', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['brash-samurai']
                },
                player2: {
                    inPlay: ['togashi-initiate'],
                    hand: ['mantra-of-fire'],
                    provinces: ['elemental-fury']
                }
            });
            this.brash = this.player1.findCardByName('brash-samurai');
            this.initiate = this.player2.findCardByName('togashi-initiate');
            this.mantra = this.player2.findCardByName('mantra-of-fire');
            this.elementalFury = this.player2.findCardByName('elemental-fury');
            this.noMoreActions();
        });

        // ruling #270: switching the contested ring doesn't change which ring was declared
        it('can be played after the declared Fire ring is switched away', function() {
            this.initiateConflict({
                type: 'military',
                ring: 'fire',
                province: this.elementalFury,
                attackers: [this.brash]
            });
            expect(this.player2).toHavePrompt('Triggered Abilities');
            this.player2.clickCard(this.elementalFury);
            this.player2.clickRing('water');
            expect(this.game.currentConflict.ring.element).toBe('water');
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.mantra);
            this.player2.clickCard(this.mantra);
            this.player2.clickCard(this.initiate);
            expect(this.initiate.fate).toBe(1);
        });
    });
});
