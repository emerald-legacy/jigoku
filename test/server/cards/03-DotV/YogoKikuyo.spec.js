describe('Yogo Kikuyo', function() {
    integration(function() {
        describe('Yogo Kikuyo\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['soshi-illusionist'],
                        hand: ['yogo-kikuyo']
                    },
                    player2: {
                        inPlay: ['solemn-scholar'],
                        hand: ['against-the-waves']
                    }
                });
                this.soshiIllusionist = this.player1.findCardByName('soshi-illusionist');
                this.yogoKikuyo = this.player1.findCardByName('yogo-kikuyo');

                this.scholar = this.player2.findCardByName('solemn-scholar');
                this.againstTheWaves = this.player2.findCardByName('against-the-waves');
            });

            it('should not trigger outside of a conflict', function() {
                this.player1.pass();
                this.player2.clickCard(this.againstTheWaves);
                this.player2.clickCard(this.scholar);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.scholar.bowed).toBe(true);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should trigger when a spell is played during a conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.soshiIllusionist],
                    defenders: []
                });
                this.player2.clickCard(this.againstTheWaves);
                this.player2.clickCard(this.scholar);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.yogoKikuyo);
            });

            it('should put this character into play (at home)', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.soshiIllusionist],
                    defenders: []
                });
                this.player2.clickCard(this.againstTheWaves);
                this.player2.clickCard(this.scholar);
                this.player1.clickCard(this.yogoKikuyo);
                expect(this.yogoKikuyo.location).toBe('play area');
                expect(this.yogoKikuyo.inConflict).toBe(false);
            });

            it('should cancel the effects of the spell', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.soshiIllusionist],
                    defenders: []
                });
                this.player2.clickCard(this.againstTheWaves);
                this.player2.clickCard(this.scholar);
                this.player1.clickCard(this.yogoKikuyo);
                expect(this.scholar.bowed).toBe(false);
            });
        });
    });
});

describe('Yogo Kikuyo and a Spell played from another deck', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['soshi-illusionist'],
                    hand: ['yogo-kikuyo', 'a-swallow-s-return'],
                    conflictDeck: ['against-the-waves']
                },
                player2: {
                    inPlay: ['solemn-scholar'],
                    hand: ['a-swallow-s-return'],
                    conflictDeck: ['against-the-waves']
                }
            });
            this.soshiIllusionist = this.player1.findCardByName('soshi-illusionist');
            this.yogoKikuyo = this.player1.findCardByName('yogo-kikuyo');
            this.swallow1 = this.player1.findCardByName('a-swallow-s-return', 'hand');
            this.scholar = this.player2.findCardByName('solemn-scholar');
            this.swallow2 = this.player2.findCardByName('a-swallow-s-return', 'hand');
            this.player1.moveCard('against-the-waves', 'conflict deck', 'conflict deck');
            this.player2.moveCard('against-the-waves', 'conflict deck', 'conflict deck');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.soshiIllusionist],
                defenders: [this.scholar]
            });
        });

        it('triggers when the opponent plays a Spell from your deck', function() {
            this.player2.clickCard(this.swallow2);
            this.player2.clickPrompt('Against the Waves');
            this.player2.clickCard(this.scholar);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.yogoKikuyo);
        });

        it('doesn\'t trigger when you play a Spell from the opponent\'s deck', function() {
            this.player2.pass();
            this.player1.clickCard(this.swallow1);
            this.player1.clickPrompt('Against the Waves');
            this.player1.clickCard(this.soshiIllusionist);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.soshiIllusionist.bowed).toBe(true);
        });
    });
});
