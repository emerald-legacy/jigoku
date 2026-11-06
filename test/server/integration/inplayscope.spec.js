describe('Player.inPlay scope', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: [{ card: 'doji-whisperer', attachments: ['fine-katana'] }],
                    dynastyDiscard: ['imperial-storehouse', 'kakita-dojo'],
                    stronghold: ['pride']
                },
                player2: {
                    inPlay: ['solemn-scholar']
                }
            });

            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.katana = this.player1.findCardByName('fine-katana');
            this.pride = this.player1.findCardByName('pride');
            this.storehouse = this.player1.placeCardInProvince('imperial-storehouse', 'province 1');
            this.dojo = this.player1.placeCardInProvince('kakita-dojo', 'province 2');
            this.dojo.facedown = true;

            this.provinces = this.player1.player.getProvinceCards();
            this.provinces.forEach((province) => {
                province.facedown = true;
            });
            this.provinces[0].facedown = false;
            this.provinces[1].facedown = false;
            this.provinces[1].isBroken = true;

            this.uuids = (cards) => cards.map((card) => card.uuid).sort();
        });

        it('includes only the controller\'s characters by default', function () {
            expect(this.uuids(this.player1.player.inPlay())).toEqual([this.whisperer.uuid]);
        });

        it('adds attachments when asked', function () {
            expect(this.uuids(this.player1.player.inPlay({ attachments: true }))).toEqual(this.uuids([this.whisperer, this.katana]));
        });

        it('adds faceup unbroken provinces when asked', function () {
            expect(this.uuids(this.player1.player.inPlay({ provinces: true }))).toEqual(this.uuids([this.whisperer, this.provinces[0]]));
        });

        it('adds faceup holdings when asked', function () {
            expect(this.uuids(this.player1.player.inPlay({ holdings: true }))).toEqual(this.uuids([this.whisperer, this.storehouse]));
        });

        it('adds the stronghold when asked', function () {
            expect(this.uuids(this.player1.player.inPlay({ stronghold: true }))).toEqual(this.uuids([this.whisperer, this.pride]));
        });
    });
});
