describe('Moving the conflict with an attacker that cost fate to declare', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 2,
                    inPlay: ['caravan-guard'],
                    hand: ['chasing-the-sun']
                },
                player2: {
                    provinces: ['manicured-garden', 'fertile-fields', 'the-art-of-war', 'entrenched-position']
                }
            });
            this.guard = this.player1.findCardByName('caravan-guard');
            this.chasing = this.player1.findCardByName('chasing-the-sun');
            this.garden = this.player2.findCardByName('manicured-garden', 'province 1');
            this.fields = this.player2.findCardByName('fertile-fields', 'province 2');
        });

        it('moves the conflict even though the attacker could not pay the declaration fate again', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                province: this.garden,
                attackers: [this.guard],
                defenders: []
            });
            expect(this.player1.fate).toBe(1);
            this.player2.pass();
            this.player1.clickCard(this.chasing);
            expect(this.player1.fate).toBe(0);
            expect(this.player1).toBeAbleToSelect(this.fields);
            this.player1.clickCard(this.fields);
            expect(this.game.currentConflict.conflictProvince).toBe(this.fields);
            expect(this.garden.inConflict).toBe(false);
        });
    });
});

describe('Moving the conflict as the defender after the attacker spent its last fate on the declaration', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 1,
                    inPlay: ['caravan-guard']
                },
                player2: {
                    provinces: ['public-forum', 'sanpuku-seido'],
                    inPlay: ['serene-warrior'],
                    hand: ['talisman-of-the-sun']
                }
            });
            this.player1.pass();
            this.talisman = this.player2.playAttachment('talisman-of-the-sun', 'serene-warrior');
            this.seido = this.player2.findCardByName('sanpuku-seido');
            this.noMoreActions();
            this.initiateConflict({
                ring: 'air',
                province: 'public-forum',
                attackers: ['caravan-guard'],
                defenders: ['serene-warrior']
            });
        });

        it('lets the defender move the conflict to another of their provinces', function() {
            expect(this.player1.fate).toBe(0);
            this.player2.clickCard(this.talisman);
            expect(this.player2).toBeAbleToSelect(this.seido);
            this.player2.clickCard(this.seido);
            expect(this.game.currentConflict.conflictProvince).toBe(this.seido);
        });
    });
});
