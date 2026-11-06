describe('Protected Merchant', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    dynastyDiscard: ['hidden-moon-dojo', 'karada-district', 'chisei-district'],
                    inPlay: ['protected-merchant']
                },
                player2: {
                    dynastyDiscard: ['imperial-storehouse']
                }
            });

            this.merchant = this.player1.findCardByName('protected-merchant');
            this.player2.placeCardInProvince('imperial-storehouse', 'province 1');
        });

        it('gains 1 glory per holding you control', function () {
            expect(this.merchant.glory).toBe(0);

            this.player1.placeCardInProvince('hidden-moon-dojo', 'province 1');
            expect(this.merchant.glory).toBe(1);

            this.player1.placeCardInProvince('karada-district', 'province 2');
            expect(this.merchant.glory).toBe(2);
        });

        it('has a max of 2 glory gained through effect', function () {
            this.player1.placeCardInProvince('hidden-moon-dojo', 'province 1');
            this.player1.placeCardInProvince('karada-district', 'province 2');
            this.player1.placeCardInProvince('chisei-district', 'province 3');
            expect(this.merchant.glory).toBe(2);
        });
    });
});

describe('Protected Merchant copied by Shosuro Actor', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['shosuro-actor']
                },
                player2: {
                    inPlay: ['protected-merchant'],
                    dynastyDiscard: ['imperial-storehouse', 'kaiu-forges']
                }
            });
            this.actor = this.player1.findCardByName('shosuro-actor');
            this.merchant = this.player2.findCardByName('protected-merchant');
            this.player2.placeCardInProvince('imperial-storehouse', 'province 1').facedown = false;
            this.player2.placeCardInProvince('kaiu-forges', 'province 2').facedown = false;
            this.game.checkGameState(true);
        });

        it('counts the holdings of the copy\'s controller', function() {
            expect(this.merchant.glory).toBe(this.merchant.printedGlory + 2);
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.actor],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.actor);
            this.player1.clickCard(this.merchant);
            expect(this.actor.name).toBe('Protected Merchant');
            expect(this.actor.glory).toBe(this.merchant.printedGlory);
        });
    });
});
