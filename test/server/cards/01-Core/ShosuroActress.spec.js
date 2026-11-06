describe('Shosuro Actress', function() {
    integration(function() {
        describe('Shosuro Actress\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shosuro-actress']
                    },
                    player2: {
                        hand: ['steward-of-law', 'for-shame', 'for-shame', 'banzai'],
                        dynastyDiscard: ['doji-shigeru']
                    }
                });
                this.shosuroActress = this.player1.findCardByName('shosuro-actress');
                this.dojiShigeru = this.player2.findCardByName('doji-shigeru');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.shosuroActress],
                    defenders: []
                });
                this.player2.playCharacterFromHand('steward-of-law');
                this.player2.clickPrompt('Conflict');
                this.player1.pass();
                this.player2.clickCard('for-shame');
                this.player2.clickCard(this.shosuroActress);
            });

            it('should allow use of triggered abilities by the new character', function() {
                expect(this.shosuroActress.bowed).toBe(true);
                this.player1.clickCard(this.shosuroActress);
                expect(this.player1).toHavePrompt('Shosuro Actress');
                expect(this.player1).toBeAbleToSelect(this.dojiShigeru);
                this.player1.clickCard(this.dojiShigeru);
                expect(this.dojiShigeru.location).toBe('play area');
                expect(this.dojiShigeru.controller).toBe(this.player1.player);
                this.player2.clickCard('for-shame', 'hand');
                expect(this.player2).toHavePrompt('For Shame!');
                this.player2.clickCard(this.dojiShigeru);
                expect(this.player1).toHavePrompt('Triggered Abilities');
            });
        });
    });
});

describe('Shosuro Actress target restrictions', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['shosuro-actress'],
                    dynastyDiscard: ['brash-samurai']
                },
                player2: {
                    inPlay: ['doji-whisperer'],
                    dynastyDiscard: ['doji-shigeru', 'alibi-artist', 'persuasive-counselor'],
                    conflictDiscard: ['steward-of-law']
                }
            });
            this.shosuroActress = this.player1.findCardByName('shosuro-actress');
            this.brashSamurai = this.player1.findCardByName('brash-samurai');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.dojiShigeru = this.player2.findCardByName('doji-shigeru');
            this.alibiArtist = this.player2.findCardByName('alibi-artist');
            this.counselor = this.player2.findCardByName('persuasive-counselor');
            this.steward = this.player2.findCardByName('steward-of-law');
        });

        it('offers non-Shinobi characters with printed cost 3 or lower in an opponent\'s discard piles', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.shosuroActress],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.shosuroActress);
            expect(this.player1).toHavePrompt('Shosuro Actress');
            expect(this.player1).toBeAbleToSelect(this.dojiShigeru);
            expect(this.player1).toBeAbleToSelect(this.steward);
            expect(this.player1).not.toBeAbleToSelect(this.alibiArtist);
            expect(this.player1).not.toBeAbleToSelect(this.counselor);
            expect(this.player1).not.toBeAbleToSelect(this.brashSamurai);
        });

        it('puts a character from the opponent\'s conflict discard pile into the conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.shosuroActress],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.shosuroActress);
            this.player1.clickCard(this.steward);
            expect(this.shosuroActress.location).toBe('dynasty discard pile');
            expect(this.steward.location).toBe('play area');
            expect(this.steward.controller).toBe(this.player1.player);
            expect(this.steward.isParticipating()).toBe(true);
        });

        it('cannot be used outside a conflict', function() {
            expect(this.player1).toHavePrompt('Action Window');
            this.player1.clickCard(this.shosuroActress);
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.shosuroActress.location).toBe('play area');
            expect(this.dojiShigeru.location).toBe('dynasty discard pile');
        });
    });
});

describe('Shosuro Actress and unique characters', function() {
    integration(function() {
        describe('when the opponent has a copy in play', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shosuro-actress']
                    },
                    player2: {
                        inPlay: ['doji-shigeru'],
                        dynastyDiscard: ['doji-shigeru', 'doji-whisperer']
                    }
                });
                this.shosuroActress = this.player1.findCardByName('shosuro-actress');
                this.shigeruInDiscard = this.player2.findCardByName('doji-shigeru', 'dynasty discard pile');
                this.whisperer = this.player2.findCardByName('doji-whisperer', 'dynasty discard pile');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.shosuroActress],
                    defenders: []
                });
                this.player2.pass();
            });

            it('cannot put another copy of a unique character the opponent controls into play', function() {
                this.player1.clickCard(this.shosuroActress);
                expect(this.player1).toHavePrompt('Shosuro Actress');
                expect(this.player1).toBeAbleToSelect(this.whisperer);
                expect(this.player1).not.toBeAbleToSelect(this.shigeruInDiscard);
            });
        });

        describe('when you control a copy', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shosuro-actress', 'doji-shigeru']
                    },
                    player2: {
                        dynastyDiscard: ['doji-shigeru', 'doji-whisperer']
                    }
                });
                this.shosuroActress = this.player1.findCardByName('shosuro-actress');
                this.shigeruInDiscard = this.player2.findCardByName('doji-shigeru', 'dynasty discard pile');
                this.whisperer = this.player2.findCardByName('doji-whisperer', 'dynasty discard pile');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.shosuroActress],
                    defenders: []
                });
                this.player2.pass();
            });

            it('cannot put another copy of a unique character you control into play', function() {
                this.player1.clickCard(this.shosuroActress);
                expect(this.player1).toHavePrompt('Shosuro Actress');
                expect(this.player1).toBeAbleToSelect(this.whisperer);
                expect(this.player1).not.toBeAbleToSelect(this.shigeruInDiscard);
            });
        });
    });
});
