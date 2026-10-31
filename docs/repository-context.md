# Ngữ cảnh repository — code-push-server

Máy chủ và CLI phân phối cập nhật CodePush.

## 1. Trách nhiệm và luồng xử lý

api phục vụ quản lý app/deployment, metadata và bundle; cli là công cụ khách riêng. Storage và secret được cấu hình cho runtime, không nhúng vào gói mobile.

Giữ ranh giới deployment, target binary version, rollout và rollback. OTA chỉ áp dụng phần tương thích với binary hiện có. Release/promote/rollback thay phiên bản người dùng nhận; không dùng để thử kết nối.

## 2. Điểm bắt đầu trong mã

- [api](../api).
- [cli](../cli).
- [deploy.sh](../deploy.sh).
- [README.md](../README.md).

Đọc hướng dẫn tại thư mục con trước khi sửa module tương ứng. Đối chiếu hợp đồng và nơi gọi khi thay đổi API, dữ liệu hoặc thư viện dùng chung.

## 3. Toolchain và kiểm chứng

Phiên bản và lệnh được quản lý trong manifest của từng package; giữ lockfile đang được đường build sử dụng. Với monorepo, chạy tại đúng package hoặc qua workspace. Không nâng toolchain chỉ để làm một lệnh cũ chạy được.

| Manifest | Toolchain được khai báo |
| --- | --- |
| [api/package.json](../api/package.json) | node >=18.0.0; npm >=9.0.0; typescript ^5.0.4 |
| [cli/package.json](../cli/package.json) | typescript ^5.1.3 |

| Mục đích | Thư mục chạy | Lệnh | Điều kiện và tác động |
| --- | --- | --- | --- |
| lint | `api` | `npm run lint` | Kiểm tra tĩnh; không thay thế kiểm thử hành vi. Script: `npx eslint ./script/**/*.ts`. |
| build | `api` | `npm run build` | Tạo artifact; có thể tải dependency hoặc gọi nguồn dữ liệu khi build, không đồng nghĩa đã deploy. Script: `tsc && shx cp -r ./script/views ./bin/script`. |
| lint | `cli` | `npm run lint` | Kiểm tra tĩnh; không thay thế kiểm thử hành vi. Script: `npx eslint ./script/**/*.ts`. |
| build | `cli` | `npm run build` | Tạo artifact; có thể tải dependency hoặc gọi nguồn dữ liệu khi build, không đồng nghĩa đã deploy. Script: `tsc`. |

Điểm vào bộ kiểm thử: [api/test/acquisition.ts](../api/test/acquisition.ts), [api/test/converter.ts](../api/test/converter.ts), [api/test/management.ts](../api/test/management.ts), [api/test/package-diffing.ts](../api/test/package-diffing.ts). Đọc setup/fixture trước khi chạy rộng hơn; những đường dẫn này không biểu thị mức bao phủ của toàn hệ thống.

Ghi kết quả và phạm vi thực sự đã chạy trong PR. Không ghi build, lint hoặc test thành công khi mới đọc cấu hình hay khi script không thực thi assertion.

## 4. Cấu hình và phát hành

Đường tự động hóa được xác định trong các workflow sau. Điều kiện branch/tag/path quyết định lúc chạy; bước phát hành cần được đọc cùng quyền và môi trường của job.

| Workflow | Điều kiện kích hoạt |
| --- | --- |
| [.github/workflows/codepush-server.yml](../.github/workflows/codepush-server.yml) | push; branches=main; paths=api/**, .github/workflows/codepush-server.yml |
| [.github/workflows/codeql.yml](../.github/workflows/codeql.yml) | push; branches=main; pull_request; branches=main; schedule |

Cấu hình đóng gói/chạy: [api/Dockerfile](../api/Dockerfile).

Dùng credential được cấp cho đúng môi trường. Không lưu secret hoặc dữ liệu cá nhân vào mã, tài liệu, ảnh chụp hay log. Migration, seed, publish, gửi thông báo và rollout là thao tác có tác động; chỉ thực hiện trong phạm vi công việc và môi trường đã được giao. Phiên bản đang phục vụ cần được xác định từ artifact/deployment, không chỉ từ default branch.

## 5. Tiêu chuẩn chung và duy trì

Áp dụng [Engineering Standards](https://github.com/droppii/engineering-knowledge/tree/docs/repository-context-pilot/handbook/standards/standards.md), [Principles](https://github.com/droppii/engineering-knowledge/tree/docs/repository-context-pilot/handbook/principles/principles.md) và [AI Context](https://github.com/droppii/engineering-knowledge/tree/docs/repository-context-pilot/handbook/ai-context/README.md). Cấu trúc đang có giải thích cách tìm mã; những phần chưa theo tiêu chuẩn cần được cải thiện khi sửa, không trở thành ngoại lệ mặc định.

Cập nhật tài liệu này trong cùng thay đổi khi module, toolchain, public contract, pipeline hoặc điều kiện kiểm thử thay đổi. Quyết định đặc thù cần được ghi ở repository; kiến thức và tiêu chuẩn dùng chung được duy trì tại Engineering Knowledge.
