describe('Seeker Initiate', function() {
    integration(function() {
        describe('Seeker Initiate after a conflict', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        role: 'seeker-of-air',
                        inPlay: ['seeker-initiate', 'doji-whisperer'],
                        conflictDiscard: ['court-games', 'banzai', 'fine-katana', 'charge', 'rout', 'assassination']
                    },
                    player2: {
                        inPlay: ['doji-whisperer', 'kakita-asami'],
                        provinces: ['entrenched-position']
                    }
                });
                this.initiate = this.player1.findCardByName('seeker-initiate');
                this.whisperer = this.player1.findCardByName('doji-whisperer');
                this.p2Whisperer = this.player2.findCardByName('doji-whisperer');
                this.asami = this.player2.findCardByName('kakita-asami');
                this.courtGames = this.player1.moveCard('court-games', 'conflict deck');
                this.banzai = this.player1.moveCard('banzai', 'conflict deck');
                this.katana = this.player1.moveCard('fine-katana', 'conflict deck');
                this.charge = this.player1.moveCard('charge', 'conflict deck');
                this.rout = this.player1.moveCard('rout', 'conflict deck');
                this.assassination = this.player1.moveCard('assassination', 'conflict deck');
                this.noMoreActions();
            });

            it('searches the top 5 cards of the conflict deck for a card and adds it to the hand, then shuffles, after you claim a ring of your role\'s element', function() {
                this.initiateConflict({
                    type: 'political',
                    ring: 'air',
                    province: 'entrenched-position',
                    attackers: [this.whisperer],
                    defenders: []
                });
                this.noMoreActions();
                this.player1.clickPrompt('Gain 2 Honor');
                expect(this.game.rings.air.claimedBy).toBe(this.player1.player.name);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.initiate);
                this.player1.clickCard(this.initiate);
                expect(this.player1).toHavePromptButton('Assassination');
                expect(this.player1).toHavePromptButton('Rout');
                expect(this.player1).toHavePromptButton('Charge!');
                expect(this.player1).toHavePromptButton('Fine Katana');
                expect(this.player1).toHavePromptButton('Banzai!');
                expect(this.player1).not.toHavePromptButton('Court Games');
                this.player1.clickPrompt('Charge!');
                expect(this.charge.location).toBe('hand');
                expect(this.player1.hand.length).toBe(1);
                expect(this.player1.conflictDeck.length).toBe(13);
                expect(this.getChatLogs(3)).toContain('player1 is shuffling their conflict deck');
                expect(this.courtGames.location).toBe('conflict deck');
                expect(this.banzai.location).toBe('conflict deck');
                expect(this.katana.location).toBe('conflict deck');
                expect(this.rout.location).toBe('conflict deck');
                expect(this.assassination.location).toBe('conflict deck');
            });

            it('does not trigger after you claim a ring that does not match your role\'s element', function() {
                this.initiateConflict({
                    type: 'political',
                    ring: 'fire',
                    province: 'entrenched-position',
                    attackers: [this.whisperer],
                    defenders: []
                });
                this.noMoreActions();
                this.player1.clickPrompt('Don\'t resolve');
                expect(this.game.rings.fire.claimedBy).toBe(this.player1.player.name);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('does not trigger when your opponent claims a ring of your role\'s element', function() {
                this.initiateConflict({
                    type: 'political',
                    ring: 'air',
                    province: 'entrenched-position',
                    attackers: [this.whisperer],
                    defenders: [this.p2Whisperer, this.asami]
                });
                this.noMoreActions();
                expect(this.game.rings.air.claimedBy).toBe(this.player2.player.name);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).toHavePrompt('Action Window');
            });
        });

        describe('Seeker Initiate with a ring that gained the role\'s element', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        role: 'seeker-of-air',
                        inPlay: ['seeker-initiate', 'doji-whisperer', 'seeker-of-knowledge']
                    },
                    player2: {
                        inPlay: ['doji-whisperer'],
                        provinces: ['entrenched-position']
                    }
                });
                this.initiate = this.player1.findCardByName('seeker-initiate');
                this.whisperer = this.player1.findCardByName('doji-whisperer');
                this.seekerOfKnowledge = this.player1.findCardByName('seeker-of-knowledge');
                this.p2Whisperer = this.player2.findCardByName('doji-whisperer');
            });

            it('triggers after you claim a ring that gained your role\'s element during the conflict (ruling #97)', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    ring: 'earth',
                    province: 'entrenched-position',
                    attackers: [this.whisperer, this.seekerOfKnowledge],
                    defenders: [this.p2Whisperer]
                });
                this.noMoreActions();
                this.player1.clickRing('air');
                this.player1.clickPrompt('Gain 2 Honor');
                expect(this.game.rings.earth.claimedBy).toBe(this.player1.player.name);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.initiate);
                this.player1.clickCard(this.initiate);
                expect(this.player1).toHavePromptButton('Take nothing');
                this.player1.clickPrompt('Supernatural Storm (5)');
                expect(this.player1.hand.length).toBe(1);
            });
        });

        describe('Seeker Initiate with Isawa Kaede', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        role: 'seeker-of-void',
                        inPlay: ['seeker-initiate', 'isawa-kaede']
                    },
                    player2: {
                        inPlay: ['doji-whisperer'],
                        provinces: ['entrenched-position']
                    }
                });
                this.initiate = this.player1.findCardByName('seeker-initiate');
                this.kaede = this.player1.findCardByName('isawa-kaede');
                this.p2Whisperer = this.player2.findCardByName('doji-whisperer');
            });

            it('triggers after you claim a ring that gained the Void element through Isawa Kaede (ruling #60)', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    ring: 'air',
                    province: 'entrenched-position',
                    attackers: [this.kaede],
                    defenders: [this.p2Whisperer]
                });
                this.noMoreActions();
                this.player1.clickRing('air');
                this.player1.clickPrompt('Done');
                this.player1.clickPrompt('Gain 2 Honor');
                expect(this.game.rings.air.claimedBy).toBe(this.player1.player.name);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.initiate);
                this.player1.clickCard(this.initiate);
                this.player1.clickPrompt('Supernatural Storm (5)');
                expect(this.player1.hand.length).toBe(1);
            });
        });

        describe('Seeker Initiate and Know the World', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        role: 'seeker-of-air',
                        inPlay: ['seeker-initiate'],
                        hand: ['know-the-world']
                    }
                });
                this.initiate = this.player1.findCardByName('seeker-initiate');
                this.player1.claimRing('fire');
            });

            it('does not trigger when Know the World puts a ring of your role\'s element into your claimed ring pool (ruling #174)', function() {
                this.player1.clickCard('know-the-world');
                this.player1.clickRing('fire');
                this.player1.clickRing('air');
                expect(this.game.rings.air.claimedBy).toBe(this.player1.player.name);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).toHavePrompt('Action Window');
            });
        });

        describe('Seeker Initiate and Secluded Shrine', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'draw',
                    player1: {
                        role: 'seeker-of-air',
                        inPlay: ['seeker-initiate'],
                        dynastyDeck: ['secluded-shrine']
                    }
                });
                this.initiate = this.player1.findCardByName('seeker-initiate');
                this.shrine = this.player1.placeCardInProvince('secluded-shrine', 'province 1');
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
            });

            it('does not trigger when Secluded Shrine makes you considered to have a ring of your role\'s element (ruling #357)', function() {
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickCard(this.shrine);
                this.player1.clickRing('air');
                expect(this.game.rings.air.isConsideredClaimed(this.player1.player)).toBe(true);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).toHavePrompt('Action Window');
            });
        });
    });
});
