describe('Hida Backbreaker', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['hida-backbreaker', 'shiba-tsukune', 'solemn-scholar'],
                    hand: ['cloud-the-mind']
                },
                player2: {
                    inPlay: ['daidoji-uji', 'isawa-ujina'],
                    hand: ['cloud-the-mind', 'fine-katana']
                }
            });
            this.hida = this.player1.findCardByName('hida-backbreaker');
            this.shibaTsukune = this.player1.findCardByName('shiba-tsukune');
            this.daidojiUji = this.player2.findCardByName('daidoji-uji');
            this.ujina = this.player2.findCardByName('isawa-ujina');
            this.cloud = this.player2.findCardByName('cloud-the-mind');
            this.ownCloud = this.player1.findCardByName('cloud-the-mind');
            this.katana = this.player2.findCardByName('fine-katana');
            this.noMoreActions();
        });

        it('should trigger and honor a character after winning a conflict', function () {
            this.initiateConflict({
                attackers: [this.hida, this.shibaTsukune],
                defenders: [this.daidojiUji]
            });
            this.player2.pass();
            this.player1.pass();
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.hida);
            this.player1.clickCard(this.hida);
            expect(this.player1).not.toBeAbleToSelect(this.hida);
            expect(this.player1).not.toBeAbleToSelect(this.shibaTsukune);
            expect(this.player1).toBeAbleToSelect(this.daidojiUji);
            expect(this.player1).not.toBeAbleToSelect(this.ujina);
            this.player1.clickCard(this.daidojiUji);
            expect(this.daidojiUji.isDishonored).toBe(true);
            expect(this.getChatLogs(5)).toContain('player1 uses Hida Backbreaker to dishonor Daidoji Uji');
        });

        it('should not trigger if not participating', function () {
            this.initiateConflict({
                attackers: [this.shibaTsukune],
                defenders: [this.daidojiUji],
                type: 'political'
            });
            this.player2.pass();
            this.player1.pass();
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
        });

        it('should not trigger after losing the conflict', function () {
            this.initiateConflict({
                attackers: [this.hida],
                defenders: [this.daidojiUji]
            });
            this.player2.pass();
            this.player1.pass();
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
        });

        it('no opponents attachments', function () {
            this.initiateConflict({
                attackers: [this.shibaTsukune],
                defenders: [this.daidojiUji],
                type: 'political'
            });
            this.player2.clickCard(this.cloud);
            expect(this.player2).toBeAbleToSelect(this.shibaTsukune);
            expect(this.player2).toBeAbleToSelect(this.ujina);
            expect(this.player2).toBeAbleToSelect(this.daidojiUji);
            expect(this.player2).not.toBeAbleToSelect(this.hida);
        });

        it('allows opponents attachments while blank', function () {
            this.initiateConflict({
                attackers: [this.shibaTsukune],
                defenders: [this.daidojiUji],
                type: 'political'
            });
            this.player2.pass();
            this.player1.clickCard(this.ownCloud);
            this.player1.clickCard(this.hida);
            expect(this.hida.isBlank()).toBe(true);
            this.player2.clickCard(this.katana);
            expect(this.player2).toBeAbleToSelect(this.hida);
            this.player2.clickCard(this.hida);
            expect(this.katana.parent).toBe(this.hida);
        });
    });
});

describe('Hida Backbreaker and an attachment taken from the opponent', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['jak-ithith', 'hida-backbreaker']
                },
                player2: {
                    inPlay: ['doji-whisperer'],
                    hand: ['fine-katana']
                }
            });
            this.jak = this.player1.findCardByName('jak-ithith');
            this.backbreaker = this.player1.findCardByName('hida-backbreaker');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.katana = this.player2.findCardByName('fine-katana');
            this.player1.pass();
            this.player2.playAttachment(this.katana, this.whisperer);
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.jak],
                type: 'military'
            });
            this.player1.clickPrompt('No Target');
            this.player2.clickCard(this.whisperer);
            this.player2.clickPrompt('Done');
            this.player2.pass();
            this.player1.pass();
        });

        it('can take an opponent\'s attachment that you will control', function() {
            this.player1.clickCard(this.jak);
            this.player1.clickCard(this.katana);
            expect(this.player1).toBeAbleToSelect(this.jak);
            expect(this.player1).toBeAbleToSelect(this.backbreaker);
            this.player1.clickCard(this.backbreaker);
            expect(this.katana.parent).toBe(this.backbreaker);
        });
    });
});
