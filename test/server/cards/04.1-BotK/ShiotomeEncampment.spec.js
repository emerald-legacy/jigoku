describe('Shiotome Encampment', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    dynastyDeck: ['shiotome-encampment'],
                    inPlay: ['miya-mystic', 'aggressive-moto']
                }
            });
            this.shiotomeEncampment = this.player1.placeCardInProvince(
                'shiotome-encampment',
                'province 1'
            );
            this.miyaMystic = this.player1.findCardByName('miya-mystic');
            this.aggressiveMoto = this.player1.findCardByName('aggressive-moto');
            this.miyaMystic.bow();
            this.aggressiveMoto.bow();
        });

        describe('Using Shiotome Encampment', function() {
            it('shouldn\'t work if there is no claimed ring', function() {
                this.player1.clickCard(this.shiotomeEncampment);
                expect(this.player1).toHavePrompt('Initiate an action');
            });

            it('shouldn\'t work if the only claimed ring is political', function() {
                this.game.rings.earth.claimRing(this.player1);
                this.player1.clickCard(this.shiotomeEncampment);
                expect(this.player1).toHavePrompt('Initiate an action');
            });

            it('should work if at least one claimed ring is military', function() {
                this.game.rings.air.claimRing(this.player1);
                this.game.rings.earth.claimRing(this.player1);
                this.player1.clickCard(this.shiotomeEncampment);
                expect(this.player1).toHavePrompt('Choose a character');
            });

            it('should only target cavalry characters', function() {
                this.game.rings.air.claimRing(this.player1);
                this.player1.clickCard(this.shiotomeEncampment);
                expect(this.player1).toBeAbleToSelect(this.aggressiveMoto);
                expect(this.player1).not.toBeAbleToSelect(this.miyaMystic);
            });

            it('should ready bowed character', function() {
                this.game.rings.air.claimRing(this.player1);
                this.player1.clickCard(this.shiotomeEncampment);
                this.player1.clickCard(this.aggressiveMoto);
                expect(this.aggressiveMoto.bowed).not.toBe(true);
            });
        });
    });
});

describe('Shiotome Encampment - Secluded Shrine ring', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'draw',
                player1: {
                    dynastyDeck: ['secluded-shrine', 'shiotome-encampment'],
                    inPlay: ['doji-whisperer', 'aggressive-moto']
                },
                player2: {
                    inPlay: ['doji-challenger']
                }
            });
            this.secludedShrine = this.player1.placeCardInProvince('secluded-shrine', 'province 1');
            this.shiotomeEncampment = this.player1.placeCardInProvince('shiotome-encampment', 'province 2');
            this.dojiWhisperer = this.player1.findCardByName('doji-whisperer');
            this.aggressiveMoto = this.player1.findCardByName('aggressive-moto');

            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');
            this.noMoreActions();
            this.player1.clickCard(this.secludedShrine);
            this.player1.clickRing('fire');
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                ring: 'fire',
                attackers: [this.dojiWhisperer],
                defenders: []
            });
            this.aggressiveMoto.bow();
            this.player2.pass();
        });

        // the Shrine's ring has no type until a player claims it (ruling #666)
        it('should not count the contested ring considered claimed as a military ring', function() {
            expect(this.game.rings.fire.isConsideredClaimed(this.player1.player)).toBe(true);
            expect(this.game.rings.fire.isClaimed()).toBe(false);
            expect(this.player1).toHavePrompt('Conflict Action Window');

            this.player1.clickCard(this.shiotomeEncampment);
            expect(this.player1).not.toHavePrompt('Choose a character');
            expect(this.aggressiveMoto.bowed).toBe(true);
        });
    });
});
